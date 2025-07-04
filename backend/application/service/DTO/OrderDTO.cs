using aggregates.Customer;

namespace DTO.OrderDTO
{
    public class CreateOrderDto
    {
        public Guid CustomerId;
        public Guid? VoucherId;

        public double TotalPrice;

        public CustomerType customerType;

        public List<OrderItemDTO> Items { get; set; } = new();
    }

    public class OrderItemDTO
    {
        public Guid DrinkId;
        public int Quantity;
        public string? DrinkName;
    }
}
