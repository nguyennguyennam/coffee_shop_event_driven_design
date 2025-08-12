using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using backend.application.Payments.Command;
using backend.application.Payments.Handlers;
using backend.domain.Aggregates.Payment;
using backend.domain.Repositories.IPaymentRepository;
using Infrastructure.Services;
using service.usecase.IPaymentUseCase;

namespace service.implement
{
    public class PaymentUseCase : IPaymentUseCase
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly VNPayService _vnPayService;
        private readonly CreatePaymentHandler _createPaymentHandler;
        private readonly ProcessPaymentHandler _processPaymentHandler;
        private readonly RefundPaymentHandler _refundPaymentHandler;


        public PaymentUseCase(
            IPaymentRepository paymentRepository,
            VNPayService vnPayService,
            CreatePaymentHandler createPaymentHandler,
            ProcessPaymentHandler processPaymentHandler,
            RefundPaymentHandler refundPaymentHandler
            )
        {
            _paymentRepository = paymentRepository;
            _vnPayService = vnPayService;
            _createPaymentHandler = createPaymentHandler;
            _processPaymentHandler = processPaymentHandler;
            _refundPaymentHandler = refundPaymentHandler;
        }

        public async Task<string> CreatePaymentUrlAsync(Guid orderId, decimal amount, string returnUrl, string ipAddress, Guid userId)
        {
            // Validate inputs
            if (orderId == Guid.Empty) throw new ArgumentException("Order ID cannot be empty", nameof(orderId));
            if (amount <= 0) throw new ArgumentException("Amount must be greater than zero", nameof(amount));
            if (string.IsNullOrEmpty(returnUrl)) throw new ArgumentException("Return URL cannot be empty", nameof(returnUrl));
            if (string.IsNullOrEmpty(ipAddress)) throw new ArgumentException("IP Address cannot be empty", nameof(ipAddress));
            {
                // Create payment record
                var paymentId = Guid.NewGuid();
                var createCommand = new CreatePaymentCommand(
                    paymentId,
                    orderId,
                    amount,
                    PaymentMethod.VNPay,
                    returnUrl,
                    userId,
                    ipAddress);

                await _createPaymentHandler.Handle(createCommand);

                // Create VNPay payment URL
                var vnPayRequest = new VNPayRequest
                {
                    OrderId = orderId,
                    Amount = amount,
                    OrderInfo = $"Thanh toan don hang {orderId}",
                    ReturnUrl = returnUrl,
                    UserId = userId,
                    IpAddress = ipAddress
                };

                return _vnPayService.CreatePaymentUrl(vnPayRequest);
            }
        }

        public async Task<Payment> ProcessVNPayCallbackAsync(IQueryCollection queryParams)
        {
            var vnPayResponse = _vnPayService.ProcessCallback(queryParams);

            if (!vnPayResponse.IsValidSignature)
            {
                throw new InvalidOperationException("Invalid VNPay signature");
            }

            var payment = await _paymentRepository.GetByOrderIdAsync(vnPayResponse.OrderId);
            if (payment == null)
            {
                throw new InvalidOperationException($"Payment for order {vnPayResponse.OrderId} not found");
            }

            var status = vnPayResponse.IsSuccess ? PaymentStatus.Success : PaymentStatus.Failed;
            var processCommand = new ProcessPaymentCommand(
                payment.Id,
                vnPayResponse.TransactionId,
                vnPayResponse.ResponseCode,
                status);

            await _processPaymentHandler.Handle(processCommand);

            return await _paymentRepository.GetByIdAsync(payment.Id) ?? payment;
        }

        public async Task<Payment?> GetPaymentByIdAsync(Guid paymentId)
        {
            return await _paymentRepository.GetByIdAsync(paymentId);
        }

        public async Task<Payment?> GetPaymentByOrderIdAsync(Guid orderId)
        {
            return await _paymentRepository.GetByOrderIdAsync(orderId);
        }

        public async Task<List<Payment>> GetAllPaymentsAsync()
        {
            return await _paymentRepository.GetAllAsync();
        }

        public async Task ProcessRefundAsync(Guid orderId, string refundReason)
        {
            var payment = await _paymentRepository.GetByOrderIdAsync(orderId);
            if (payment == null)
            {
                throw new InvalidOperationException($"Payment for order {orderId} not found");
            }

            if (payment.Status != PaymentStatus.Success)
            {
                throw new InvalidOperationException("Only successful payments can be refunded");
            }

            var refundCommand = new RefundPaymentCommand(payment.Id, payment.Amount, refundReason);
            await _refundPaymentHandler.Handle(refundCommand);
        }
        
        // public async Task UpdateOrderStatusAsync(Guid orderId, PaymentStatus status)
        // {
        //     var payment = await _paymentRepository.GetByOrderIdAsync(orderId);
        //     if (payment == null)
        //     {
        //         throw new InvalidOperationException($"Payment for order {orderId} not found");
        //     }
        //     payment.UpdateStatus(status);
        //     await _paymentRepository.UpdateAsync(payment);
        // }
    }
}
