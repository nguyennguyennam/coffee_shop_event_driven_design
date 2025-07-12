using aggregates.Order;
using Application.Orders.Commands;


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
            var events =  await eventStore.GetEventsForAggregate(command.OrderId);
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