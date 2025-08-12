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
        public RefundStatus RefundStatus { get; private set; }

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
        
        public void ProcessRefund(decimal refundAmount, string refundTransactionId, string refundReason)
        {
            if (Status != PaymentStatus.Success)
                throw new InvalidOperationException("Can only refund successful payments");

            if (refundAmount <= 0)
                throw new ArgumentException("Refund amount must be greater than zero");

            if (RefundedAmount + refundAmount > Amount)
                throw new InvalidOperationException("Total refund amount cannot exceed payment amount");

            RefundedAmount += refundAmount;
            RefundTransactionId = refundTransactionId;
            RefundedAt = DateTime.UtcNow;
            RefundReason = refundReason;

            // Update status if fully refunded
            if (RefundedAmount >= Amount)
            {
                Status = PaymentStatus.Refunded;
                RefundStatus = RefundStatus.FullyRefunded;
            }
            else
            {
                RefundStatus = RefundStatus.PartiallyRefunded;
            }

            RaiseDomainEvent(new PaymentRefunded(Id, OrderId, refundAmount, RefundedAmount, refundTransactionId));
        }

        public void MarkRefundFailed(string reason)
        {
            RefundStatus = RefundStatus.RefundFailed;
            RefundReason = reason;
            
            RaiseDomainEvent(new PaymentRefundFailed(Id, OrderId, reason));
        }

        public bool CanBeRefunded()
        {
            return Status == PaymentStatus.Success && RefundedAmount < Amount;
        }

        public decimal GetRemainingRefundableAmount()
        {
            return Amount - RefundedAmount;
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
            RefundedAmount = @event.TotalRefundedAmount;
            RefundReason = @event.RefundReason;
            RefundTransactionId = @event.RefundTransactionId;
            RefundedAt = DateTime.UtcNow;
            
            if (RefundedAmount >= Amount)
            {
                Status = PaymentStatus.Refunded;
                RefundStatus = RefundStatus.FullyRefunded;
            }
            else
            {
                RefundStatus = RefundStatus.PartiallyRefunded;
            }
        }

        private void Apply(PaymentRefundFailed @event)
        {
            RefundStatus = RefundStatus.RefundFailed;
            RefundReason = @event.Reason;
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

    public enum RefundStatus
    {
        None = 0,
        PartiallyRefunded = 1,
        FullyRefunded = 2,
        RefundFailed = 3
    }
}