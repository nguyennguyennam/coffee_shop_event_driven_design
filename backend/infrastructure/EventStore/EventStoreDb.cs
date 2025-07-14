using EventStore.Client;
using backend.domain.Common.Event;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Infrastructure.EventStore
{
    public class EventStoreDb : IEventStore
    {
        private readonly EventStoreClient _client;
        private readonly JsonSerializerOptions _serialize;

        public EventStoreDb(EventStoreClient client)
        {
            _client = client;
            _serialize = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                Converters = { new JsonStringEnumConverter() }
            };
        }

        public async Task SaveEvents(Guid aggregateId, IEnumerable<Event> events, int expectedVersion)
        {
            var eventData = events.Select(e => new EventData(
                Uuid.NewUuid(),
                e.GetType().Name,
                JsonSerializer.SerializeToUtf8Bytes(e, e.GetType(), _serialize),
                contentType: "application/json"
            ));

            var streamName = $"order-{aggregateId}";
            await _client.AppendToStreamAsync(streamName, StreamState.Any, eventData);
        }

        public async Task <List<Event>> GetEventsForAggregate (Guid aggregateId)
        {
            var streamName = $"order-{aggregateId}";
            var result = _client.ReadStreamAsync(Direction.Forwards, streamName, StreamPosition.Start);

            var events = new List<Event>();
            await foreach (var resolved in result)
            {
                var json = resolved.Event.Data.ToArray();
                var eventName = resolved.Event.EventType;

                // deserialize dynamically
                var type = Type.GetType($"aggregates.Order.Events.{eventName}");
                if (type != null)
                {
                    var e = (Event?)JsonSerializer.Deserialize(json, type);
                    if (e != null) events.Add(e);
                }
            }

            return events;
        }
    }
}
