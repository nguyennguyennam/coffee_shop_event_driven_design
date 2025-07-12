using backend.application.Orders.Command;
using backend.infrastructure.Services;
using aggregates.Order;

namespace Application.Orders.Handlers
{
    public class PlaceOrderHandler
    {
        private readonly EventPublishService _eventService;

        public PlaceOrderHandler (EventPublishService eventService)
        {
            _eventService = eventService ?? throw new ArgumentNullException(nameof(eventService));
        }

        public async Task HandleAsync(PlaceOrderCommand command)
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

            await _eventService.SaveAndPublishEvents(
                order.AggregateId,
                order.GetUncommitedChanges(),
                0
            );

            order.MarkChangesAsCommited();
        }
    }
}
