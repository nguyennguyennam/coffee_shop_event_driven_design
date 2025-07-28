using aggregates.Customer;
using aggregates.Order.Events;
using backend.domain.Aggregates.Order;
using backend.domain.Aggregates.Voucher;
using backend.domain.Common.Event;
using ValueObjects.CustomerPromotion;
using ValueObjects.OrderPrice;

namespace aggregates.Order
{
    public class OrderAggregate : AggregateRoot
    {
        public Guid CustomerId { get; private set; }
        public Guid? VoucherId { get; private set; }
        public DateTime OrderDate { get; private set; }
        public string? Status { get; private set; }
        public List<OrderItem> OrderItems { get; private set; } = new();
        public Voucher? Voucher { get; private set; }
        public double TotalPrice { get; private set; }
        public Guid? ShipperId { get; private set; }


        public OrderAggregate() { } // For replay

        public OrderAggregate(
            Guid orderId,
            Guid customerId,
            Guid? voucherId,
            DateTime orderDate,
            string status,
            List<OrderItem> orderItems,
            double price,
            Voucher? voucher,
            CustomerType customerType
        )
        {
            this.AggregateId = orderId;

            ApplyChange(new OrderPlaced(
                orderId,
                customerId,
                voucherId,
                orderDate,
                status,
                orderItems,
                price,
                customerType,
                voucher
            ));
        }

        public void UpdateStatus(Guid orderId,string newStatus, Guid userId)
        {
            if (newStatus == this.Status)
                return;

            ApplyChange(new OrderStatusUpdated(orderId, newStatus, userId, this.TotalPrice, this.OrderDate));
        }
        public void AssignShipper(Guid shipperId)
        {
            if (this.ShipperId != null)
                throw new InvalidOperationException("Shipper already assigned.");

            ApplyChange(new OrderShipperAssigned(shipperId));
        }



        public void Apply(OrderPlaced e)
        {
            this.AggregateId = e.OrderId;
            this.CustomerId = e.CustomerId;
            this.VoucherId = e.VoucherId;
            this.OrderDate = e.OrderDate;
            this.Status = e.Status;
            this.OrderItems = e.OrderItems;
            this.Voucher = e.Voucher;

            var basePrice = OrderPrice.CalculateOrderPrice(e.Price, e.Voucher);
            var discount = CustomerPromotion.CalculateCustomerPromotion(e.CustomerType);
            this.TotalPrice = basePrice * (1 - discount);
        }

        public void Apply(OrderStatusUpdated e)
        {
            this.Status = e.NewStatus;
        }
        public void Apply(OrderShipperAssigned e)
        {
            this.ShipperId = e.ShipperId;
            this.Status = "Ordering"; // hoặc tách event status riêng nếu muốn
        }

    }
}
