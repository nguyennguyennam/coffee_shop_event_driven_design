using aggregates.Order.Events;
using backend.domain.Common.Event;
using backend.infrastructure.Messaging;

namespace backend.infrastructure.Services
{
    public class EventPublishService
    {
        private readonly IEventStore _event;
        private readonly KafkaEventPublish _kafka;

        public EventPublishService(IEventStore event_, KafkaEventPublish kafka)
        {
            _event = event_;
            _kafka = kafka;
        }

        public async Task SaveAndPublishEvents(Guid aggregateId, IEnumerable<Event> events, int expectedVersion)
        {
            await _event.SaveEvents(aggregateId, events, expectedVersion);
            
            string topictoPublish ="default-events";
            //Loop through events list to publish to the kafka
            foreach (var event_ in events)
            {
                if (event_ is OrderPlaced)
                {
                    topictoPublish = "order-events";
                }
                else if (event_ is OrderStatusUpdated)
                {
                    topictoPublish = "order-status-updated";
                }
                await _kafka.PublishAsync(topictoPublish, event_);
            }
        }

        public async Task<List<Event>> LoadEventStreamAsync(Guid aggregateId)
        {
            return await _event.GetEventsForAggregate(aggregateId);
        }
    }
}