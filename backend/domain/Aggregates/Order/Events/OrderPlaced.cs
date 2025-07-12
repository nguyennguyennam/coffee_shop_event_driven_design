using backend.domain.Common.Event;
using backend.domain.Aggregates.Order;
using backend.domain.Aggregates.Voucher;
using aggregates.Customer;

namespace aggregates.Order.Events
{
    public class OrderPlaced : Event
    {
        public Guid OrderId { get; }
        public Guid CustomerId { get; }
        public Guid? VoucherId { get; }
        public DateTime OrderDate { get; }
        public string Status { get; }
        public List<OrderItem> OrderItems { get; }
        public double Price { get; }
        public CustomerType CustomerType { get; }
        public Voucher? Voucher { get; }

        public OrderPlaced(Guid orderId, Guid customerId, Guid? voucherId, DateTime orderDate, string status,
                           List<OrderItem> items, double price, CustomerType customerType, Voucher? voucher)
        {
            OrderId = orderId;
            CustomerId = customerId;
            VoucherId = voucherId;
            OrderDate = orderDate;
            Status = status;
            OrderItems = items;
            Price = price;
            CustomerType = customerType;
            Voucher = voucher;
        }
    }
}
