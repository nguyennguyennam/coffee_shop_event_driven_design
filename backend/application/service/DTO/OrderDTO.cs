using aggregates.Customer;

namespace DTO.OrderDTO
{
    public class CreateOrderDto
    {
        public Guid CustomerId { get;  set; }
        public string? VoucherCode { get;  set; }

        public double TotalPrice { get; set; }

        public CustomerType customerType { get;  set; }

        public List<OrderItemDTO> Items { get; set; } = new();
    }

    public class OrderItemDTO
    {
        public Guid DrinkId { get;  set; }
        public int Quantity { get; set; }
        public string? DrinkName { get; set; }
    }
}
