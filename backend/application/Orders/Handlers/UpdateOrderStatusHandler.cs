using aggregates.Order;
using Application.Orders.Commands;
using backend.domain.Aggregates.Order;
using backend.domain.Common.Event;

namespace backend.application.Orders.Handlers
{
    public class UpdateOrderStatusHandler
    {
        private readonly IEventStore eventStore;

        public UpdateOrderStatusHandler(IEventStore eventStore_)
        {
            eventStore = eventStore_;
        }

        public async Task HandleUpdateAsync(UpdateOrderStatusCommand command)
        {
            var events =  eventStore.GetEventsForAggregate(command.OrderId);
            var aggregates = new OrderAggregate();

            aggregates.LoadFromHistory(events);

            if (command.NewStatus == null)
            {
                throw new Exception("New status is not updated");
            }

            aggregates.UpdateStatus(command.NewStatus);

            await eventStore.SaveEvents(command.OrderId, aggregates.GetUncommitedChanges(), aggregates.AggregateVersion);
            aggregates.MarkChangesAsCommited();
        }
    }
}