using aggregates.Order;
using Application.Orders.Commands;
using backend.application.interfaces.command;
using backend.application.Models;
using backend.infrastructure.Services;

namespace backend.application.Orders.Handlers
{
    public class UpdateOrderStatusHandler
    {
        private readonly IEventStore eventStore;
        private readonly IOrderCommand _command;

        private readonly EventPublishService _service;

        public UpdateOrderStatusHandler(IEventStore eventStore_, IOrderCommand command_, EventPublishService service_)
        {
            eventStore = eventStore_;
            _command = command_;
            _service = service_;
        }

        public async Task <Order> HandleUpdateAsync(UpdateOrderStatusCommand command)
        {
            var events = await eventStore.GetEventsForAggregate(command.OrderId);
            var aggregates = new OrderAggregate();

            aggregates.LoadFromHistory(events);

            if (command.NewStatus == null)
            {
                throw new Exception("New status is not updated");
            }

            aggregates.UpdateStatus(command.NewStatus);

            await _service.SaveAndPublishEvents(command.OrderId, aggregates.GetUncommitedChanges(), aggregates.AggregateVersion);

            try
            {
                var order = await _command.UpdateOrderAsync(command.OrderId, command.NewStatus);
                return order;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error updating Read Model for Order {command.OrderId}: {ex.Message}");
                throw;
            }

        }
    }
}