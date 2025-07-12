using backend.domain.Repositories.IOrderRepository;
using aggregates.Order;


namespace backend.infrastructure.repositories
{
    public class OrderAggregateRepository : IOrderAggregate
    {
        private readonly IEventStore _event;
        public OrderAggregateRepository(IEventStore event_)
        {
            _event = event_;
        }

        public async Task<OrderAggregate> GetByIdAsync(Guid AggregateId)
        {
            var events = await _event.GetEventsForAggregate(AggregateId);
            var aggregate = new OrderAggregate();

            aggregate.LoadFromHistory(events);
            return aggregate;
        }
        public async Task SaveAsync(OrderAggregate order)
        {
        await _event.SaveEvents(order.AggregateId, order.GetUncommitedChanges(), order.AggregateVersion);
        order.MarkChangesAsCommited();
        }
    }
}