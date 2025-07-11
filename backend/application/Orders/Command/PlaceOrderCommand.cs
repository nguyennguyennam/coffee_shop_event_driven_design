
using backend.domain.Aggregates.Order;
using backend.domain.Aggregates.Voucher;
using aggregates.Customer;


namespace backend.application.Orders.Command
{
    public class PlaceOrderCommand
    {
        public Guid OrderId { get; set; }
        public Guid CustomerId { get; set; }
        public Guid? VoucherId { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = "Pending";
        public List<OrderItem> OrderItems { get; set; } = new();
        public double Price { get; set; }
        public Voucher? Voucher { get; set; }
        public CustomerType CustomerType { get; set; }

        public PlaceOrderCommand(
            Guid orderId,
            Guid customerId,
            Guid? voucherId,
            DateTime orderDate,
            string status,
            List<OrderItem> orderItems,
            double price,
            Voucher? voucher,
            CustomerType customerType)
        {
            OrderId = orderId;
            CustomerId = customerId;
            VoucherId = voucherId;
            OrderDate = orderDate;
            Status = status;
            OrderItems = orderItems;
            Price = price;
            Voucher = voucher;
            CustomerType = customerType;
        }
    }
}
