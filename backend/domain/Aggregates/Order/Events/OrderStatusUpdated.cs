using backend.domain.Common.Event;

namespace aggregates.Order.Events
{
    public class OrderStatusUpdated : Event
    {
        public Guid OrderId { get; set; }
        public string? NewStatus { get; }

        public OrderStatusUpdated(Guid orderid, string newStatus)
        {
            OrderId = orderid;
            NewStatus = newStatus;
        }

    }
}