namespace Application.Orders.Commands
{
    public class UpdateOrderStatusCommand
    {
        public Guid OrderId { get; set; }
        public string? NewStatus { get; set; }
    }
}