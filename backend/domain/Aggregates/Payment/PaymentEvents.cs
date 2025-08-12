using System;
using backend.domain.Common.Event;

namespace backend.domain.Aggregates.Payment
{
    public class PaymentCreated : Event
    {
        public Guid PaymentId { get; set; }
        public Guid OrderId { get; set; }
        public decimal Amount { get; set; }

        public PaymentCreated(Guid paymentId, Guid orderId, decimal amount)
        {
            PaymentId = paymentId;
            OrderId = orderId;
            Amount = amount;
        }
    }

    public class PaymentProcessed : Event
    {
        public Guid PaymentId { get; set; }
        public PaymentStatus Status { get; set; }
        public string VNPayTransactionId { get; set; }

        public PaymentProcessed(Guid paymentId, PaymentStatus status, string vnPayTransactionId)
        {
            PaymentId = paymentId;
            Status = status;
            VNPayTransactionId = vnPayTransactionId;
        }
    }

    public class PaymentRefunded : Event
    {
        public Guid PaymentId { get; set; }
        public Guid OrderId { get; set; }
        public decimal RefundAmount { get; set; }
        public decimal TotalRefundedAmount { get; set; }
        public string RefundReason { get; set; }
        public string RefundTransactionId { get; set; }

        public PaymentRefunded(Guid paymentId, Guid orderId, decimal refundAmount, decimal totalRefundedAmount, string refundTransactionId)
        {
            PaymentId = paymentId;
            OrderId = orderId;
            RefundAmount = refundAmount;
            TotalRefundedAmount = totalRefundedAmount;
            RefundTransactionId = refundTransactionId;
        }
    }

    public class PaymentRefundFailed : Event
    {
        public Guid PaymentId { get; set; }
        public Guid OrderId { get; set; }
        public string Reason { get; set; }

        public PaymentRefundFailed(Guid paymentId, Guid orderId, string reason)
        {
            PaymentId = paymentId;
            OrderId = orderId;
            Reason = reason;
        }
    }
}