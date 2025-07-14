using backend.application.Models;

namespace Application.Orders.Commands
{
    public class UpdateOrderStatusCommand
    {
        public Guid OrderId { get; set; }
        public string? NewStatus { get; set; }
        public UpdateOrderStatusCommand(Guid orderId, string newStatus)
        {
            this.OrderId = orderId;
            this.NewStatus = newStatus;
        }
    }
}