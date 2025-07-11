using backend.domain.Common.Event;

namespace aggregates.Order.Events
{
    public class OrderStatusUpdated : Event
    {
        public string? NewStatus { get; }

        public OrderStatusUpdated(string newStatus)
        {
            NewStatus = NewStatus;
        }

    }
}