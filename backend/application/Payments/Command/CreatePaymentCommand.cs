using backend.domain.Aggregates.Payment;

namespace backend.application.Payments.Command
{
    public class CreatePaymentCommand
    {
        public Guid PaymentId { get; set; }
        public Guid OrderId { get; set; }
        public decimal Amount { get; set; }
        public PaymentMethod Method { get; set; }
        public string ReturnUrl { get; set; } = string.Empty;

        public Guid UserId { get; set; } // Optional user ID for tracking
        public string IpAddress { get; set; } = string.Empty;

        public CreatePaymentCommand(
            Guid paymentId,
            Guid orderId,
            decimal amount,
            PaymentMethod method,
            string returnUrl,
            Guid userId,
            string ipAddress)
        {
            PaymentId = paymentId;
            OrderId = orderId;
            Amount = amount;
            Method = method;
            ReturnUrl = returnUrl;
            UserId = userId;
            IpAddress = ipAddress;
        }
    }
}
