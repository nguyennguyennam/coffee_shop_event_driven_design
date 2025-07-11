using backend.application.Orders.Command;
using aggregates.Order;



namespace Application.Orders.Handlers
{
    public class PlaceOrderHandler
    {
        private readonly IEventStore _eventStore;

        public PlaceOrderHandler(IEventStore eventStore)
        {
            _eventStore = eventStore;
        }

        public Task HandleAsync(PlaceOrderCommand command)
        {
            var order = new OrderAggregate(
                command.OrderId,
                command.CustomerId,
                command.VoucherId,
                command.OrderDate,
                command.Status,
                command.OrderItems,
                command.Price,
                command.Voucher,
                command.CustomerType
            );

            _eventStore.SaveEvents(order.AggregateId, order.GetUncommitedChanges(), 0);
            order.MarkChangesAsCommited();
            return Task.CompletedTask;
        }
        
    }
}
