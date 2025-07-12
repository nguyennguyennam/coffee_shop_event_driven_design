
using Application.Orders.Commands;
using aggregates.Order;
using backend.infrastructure.Services;

namespace Application.Orders.Handlers
{
    public class AssignShipperHandler
    {
        private readonly EventPublishService _eventService;

        public AssignShipperHandler(EventPublishService eventService)
        {
            _eventService = eventService;
        }

        public async Task HandleAsync(AssignShipperCommand command)
        {
            // 1. Load existing events
            var events = await _eventService.LoadEventStreamAsync(command.OrderId);
            
            var order = new OrderAggregate(); // empty aggregate for replay
            order.LoadFromHistory(events);

            // 2. Apply domain logic
            order.AssignShipper(command.ShipperId);

            // 3. Save & publish new events
            await _eventService.SaveAndPublishEvents(
                order.AggregateId,
                order.GetUncommitedChanges(),
                order.AggregateVersion
            );

            order.MarkChangesAsCommited();
        }
    }
}
