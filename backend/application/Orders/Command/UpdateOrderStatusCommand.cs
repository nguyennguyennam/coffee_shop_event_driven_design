using backend.application.Models;

namespace Application.Orders.Commands
{
    public class UpdateOrderStatusCommand
    {
        public Guid OrderId { get; set; }
        public string? NewStatus { get; set; }

        public Guid UserId { get; set; }
        public UpdateOrderStatusCommand(Guid orderId, string newStatus, Guid userId)
        {
            OrderId = orderId;
            NewStatus = newStatus;
            UserId = userId;
        }
    }
}