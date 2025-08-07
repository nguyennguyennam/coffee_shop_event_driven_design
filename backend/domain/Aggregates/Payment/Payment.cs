using System;
using backend.domain.Common.Event;

namespace backend.domain.Aggregates.Payment
{
    public class Payment : AggregateRoot
    {
        public Guid Id
        {
            get => AggregateId;
            private set => AggregateId = value;
        }

        public Guid OrderId { get; private set; }
        public decimal Amount { get; private set; }
        public PaymentMethod Method { get; private set; }
        public PaymentStatus Status { get; private set; }
        public string? VNPayTransactionId { get; private set; }
        public string? VNPayResponseCode { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? ProcessedAt { get; private set; }
        public string? ReturnUrl { get; private set; }

        public Guid UserId { get; private set; } // Optional user ID for tracking
        public string? IpAddress { get; private set; }
        
        // Refund properties
        public decimal RefundedAmount { get; private set; }
        public string? RefundTransactionId { get; private set; }
        public DateTime? RefundedAt { get; private set; }
        public string? RefundReason { get; private set; }

        private Payment() { } // For EF Core

        public Payment(
            Guid id,
            Guid orderId,
            decimal amount,
            PaymentMethod method,
            string returnUrl,
            Guid userId,
            string ipAddress)
        {
            Id = id;
            OrderId = orderId;
            Amount = amount;
            Method = method;
            Status = PaymentStatus.Pending;
            CreatedAt = DateTime.UtcNow;
            ReturnUrl = returnUrl;
            UserId = userId;
            IpAddress = ipAddress;

            RaiseDomainEvent(new PaymentCreated(Id, OrderId, Amount));
        }

        public void ProcessPayment(string vnPayTransactionId, string responseCode, PaymentStatus status)
        {
            VNPayTransactionId = vnPayTransactionId;
            VNPayResponseCode = responseCode;
            Status = status;
            ProcessedAt = DateTime.UtcNow;

            RaiseDomainEvent(new PaymentProcessed(Id, Status, vnPayTransactionId));
        }

        public void MarkAsFailed(string responseCode)
        {
            VNPayResponseCode = responseCode;
            Status = PaymentStatus.Failed;
            ProcessedAt = DateTime.UtcNow;

            RaiseDomainEvent(new PaymentProcessed(Id, Status, string.Empty));
        }

        public void ProcessRefund(decimal refundAmount, string refundReason, string refundTransactionId)
        {
            if (Status != PaymentStatus.Success)
            {
                throw new InvalidOperationException("Only successful payments can be refunded");
            }

            if (refundAmount <= 0 || refundAmount > Amount)
            {
                throw new ArgumentException("Invalid refund amount");
            }

            RefundedAmount = refundAmount;
            RefundReason = refundReason;
            RefundTransactionId = refundTransactionId;
            RefundedAt = DateTime.UtcNow;
            Status = PaymentStatus.Refunded;

            RaiseDomainEvent(new PaymentRefunded(Id, refundAmount, refundReason, refundTransactionId));
        }

        // Apply methods for event sourcing
        protected void Apply(PaymentCreated @event)
        {
            Id = @event.PaymentId;
            OrderId = @event.OrderId;
            Amount = @event.Amount;
            Status = PaymentStatus.Pending;
            CreatedAt = DateTime.UtcNow;
        }

        private void Apply(PaymentProcessed @event)
        {
            Status = @event.Status;
            VNPayTransactionId = @event.VNPayTransactionId;
            ProcessedAt = DateTime.UtcNow;
        }

        private void Apply(PaymentRefunded @event)
        {
            RefundedAmount = @event.RefundAmount;
            RefundReason = @event.RefundReason;
            RefundTransactionId = @event.RefundTransactionId;
            RefundedAt = DateTime.UtcNow;
            Status = PaymentStatus.Refunded;
        }
    }

    public enum PaymentMethod
    {
        VNPay = 1,
        Cash = 2
    }

    public enum PaymentStatus
    {
        Pending = 1,
        Success = 2,
        Failed = 3,
        Cancelled = 4,
        Refunded = 5
    }
}