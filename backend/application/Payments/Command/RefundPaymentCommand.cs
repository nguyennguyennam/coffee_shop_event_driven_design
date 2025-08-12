namespace backend.application.Payments.Command
{
    public class RefundPaymentCommand
    {
        public Guid PaymentId { get; set; }
        public decimal RefundAmount { get; set; }
        public string RefundReason { get; set; }

        public RefundPaymentCommand(Guid paymentId, decimal refundAmount, string refundReason)
        {
            PaymentId = paymentId;
            RefundAmount = refundAmount;
            RefundReason = refundReason;
        }
    }
}