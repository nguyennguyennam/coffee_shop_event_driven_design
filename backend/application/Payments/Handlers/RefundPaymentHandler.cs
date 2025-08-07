using backend.application.Payments.Command;
using backend.domain.Repositories.IPaymentRepository;
using Infrastructure.Services;

namespace backend.application.Payments.Handlers
{
    public class RefundPaymentHandler
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly VNPayService _vnPayService;

        public RefundPaymentHandler(IPaymentRepository paymentRepository, VNPayService vnPayService)
        {
            _paymentRepository = paymentRepository;
            _vnPayService = vnPayService;
        }

        public async Task Handle(RefundPaymentCommand command)
        {
            var payment = await _paymentRepository.GetByIdAsync(command.PaymentId);
            if (payment == null)
            {
                throw new InvalidOperationException($"Payment {command.PaymentId} not found");
            }

            // Create VNPay refund request
            var refundRequest = new VNPayRefundRequest
            {
                OrderId = payment.OrderId,
                TransactionId = payment.VNPayTransactionId ?? string.Empty,
                Amount = command.RefundAmount,
                RefundInfo = command.RefundReason,
                TransactionDate = payment.CreatedAt,
                CreatedBy = "System",
                IpAddress = payment.IpAddress ?? "127.0.0.1"
            };

            // Process refund with VNPay
            var refundResponse = await _vnPayService.ProcessRefund(refundRequest);
            
            if (refundResponse.IsSuccess)
            {
                // Update payment with refund information
                payment.ProcessRefund(
                    command.RefundAmount, 
                    command.RefundReason, 
                    refundResponse.TransactionId);

                await _paymentRepository.UpdateAsync(payment);
            }
            else
            {
                throw new InvalidOperationException($"Refund failed: {refundResponse.Message}");
            }
        }
    }
}
