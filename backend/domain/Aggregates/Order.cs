using entities.OrderItem;
using entities.Voucher;

namespace aggregates.Order
{
    public class Order
    {
        public Guid Id { get; private set; }
        public Guid CustomerId { get; private set; }
        public Guid? VoucherId { get; private set; } 
        public DateTime OrderDate { get; private set; } // Date when the order was placed
        public string? Status { get; private set; } // e.g., "Pending", "Completed", "Cancelled"

        public List<OrderItem> OrderItems { get; set; } = new(); 
        public Voucher? Voucher { get; private set; }

        public double TotalPrice { get; private set; } = 0.0; // Total price of the order
    }
}