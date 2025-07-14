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

        public PaymentUseCase(
            IPaymentRepository paymentRepository,
            VNPayService vnPayService,
            CreatePaymentHandler createPaymentHandler,
            ProcessPaymentHandler processPaymentHandler)
        {
            _paymentRepository = paymentRepository;
            _vnPayService = vnPayService;
            _createPaymentHandler = createPaymentHandler;
            _processPaymentHandler = processPaymentHandler;
        }

        public async Task<string> CreatePaymentUrlAsync(Guid orderId, decimal amount, string returnUrl, string ipAddress)
        {
            // Create payment record
            var paymentId = Guid.NewGuid();
            var createCommand = new CreatePaymentCommand(
                paymentId,
                orderId,
                amount,
                PaymentMethod.VNPay,
                returnUrl,
                ipAddress);

            await _createPaymentHandler.Handle(createCommand);

            // Create VNPay payment URL
            var vnPayRequest = new VNPayRequest
            {
                OrderId = orderId,
                Amount = amount,
                OrderInfo = $"Thanh toan don hang {orderId}",
                ReturnUrl = returnUrl,
                IpAddress = ipAddress
            };

            return _vnPayService.CreatePaymentUrl(vnPayRequest);
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