using backend.domain.Common.Event;

namespace aggregates.Order.Events
{
    public class OrderShipperAssigned : Event
    {
        public Guid ShipperId { get; }

        public OrderShipperAssigned(Guid shipperId)
        {
            ShipperId = shipperId;
        }
    }
}
