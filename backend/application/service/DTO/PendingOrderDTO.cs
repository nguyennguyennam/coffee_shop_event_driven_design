namespace DTO.PendingOrderDTO
{
    public class OrderItemDTO
    {
        public Guid DrinkId { get; set; }
        public int Quantity { get; set; }
        public string? DrinkName { get; set; }
    }

    public class PendingOrderDTO
    {
        public Guid OrderId { get; set; }
        public Guid CustomerId { get; set; }
        public DateTime OrderDate { get; set; }
        public List<OrderItemDTO> Items { get; set; } = new();
        public double Price { get; set; }
    }
}