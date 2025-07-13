using aggregates.Customer;
using backend.domain.Aggregates.Order;
using backend.domain.Aggregates.Voucher;
using ValueObjects.CustomerPromotion;
using ValueObjects.OrderPrice;


namespace backend.application.Models
{
    public class Order
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; private set; }
        public Guid? VoucherId { get; private set; }
        public DateTime OrderDate { get; private set; } // Date when the order was placed
        public string? Status { get; private set; } // e.g., "Pending", "Completed", "Cancelled"

        public List<OrderItem> OrderItems { get; set; } = new();
        public Voucher? Voucher { get; private set; }

        public double TotalPrice { get; private set; } = 0.0; // Total price of the order
        public Order() { } // Default constructor for EF Core

        public Order(
            Guid OrderId,
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
            this.Id = OrderId;
            this.CustomerId = customerId;
            this.VoucherId = voucherId;
            this.OrderDate = orderDate;
            this.Status = status;
            this.OrderItems = orderItems ?? throw new ArgumentException("Order items cannot be null or empty.", nameof(orderItems));
            var basePrice = OrderPrice.CalculateOrderPrice(price, voucher);
            var discount = CustomerPromotion.CalculateCustomerPromotion(customerType);
            this.TotalPrice = basePrice * (1 - discount);
            this.Voucher = voucher;
        }

        public void UpdateStatus(string status)
        {
            this.Status = status;
        }

    }
}