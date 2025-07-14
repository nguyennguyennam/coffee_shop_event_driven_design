using backend.domain.Aggregates.Payment;

namespace backend.application.Payments.Command
{
    public class ProcessPaymentCommand
    {
        public Guid PaymentId { get; set; }
        public string VNPayTransactionId { get; set; } = string.Empty;
        public string ResponseCode { get; set; } = string.Empty;
        public PaymentStatus Status { get; set; }

        public ProcessPaymentCommand(
            Guid paymentId,
            string vnPayTransactionId,
            string responseCode,
            PaymentStatus status)
        {
            PaymentId = paymentId;
            VNPayTransactionId = vnPayTransactionId;
            ResponseCode = responseCode;
            Status = status;
        }
    }
}