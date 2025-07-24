using Confluent.Kafka;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace backend.infrastructure.Messaging
{
    public class KafkaEventPublish
    {
        private readonly IProducer<Null, string> _producer;
        private readonly JsonSerializerOptions _serialize;

        public KafkaEventPublish(string bootstrapServer, string topic)
        {
            var config = new ProducerConfig
            {
                BootstrapServers = bootstrapServer,
                Acks = Acks.All,
                MessageTimeoutMs = 5000
            };

            _producer = new ProducerBuilder<Null, string>(config).Build();
            _serialize = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                Converters = { new JsonStringEnumConverter() } 
            };
        }

        public async Task PublishAsync<T>(string _topic, T @event, string? key = null)
        {
            if (@event == null)
            {
                throw new ArgumentNullException(nameof(@event), "Event to publish cannot be null.");
            }

            
            var json = JsonSerializer.Serialize(@event, @event.GetType(), _serialize);
            try
            {
                var result = await _producer.ProduceAsync(_topic, new Message<Null, string>
                {
                    Value = json
                });
                Console.WriteLine($"✅ Sent event to Kafka topic '{_topic}': {result.TopicPartitionOffset}"); // ✅ Log rõ topic
            }
            catch (ProduceException<Null, string> e)
            {
                Console.WriteLine($"❌ Kafka publish failed: {e.Error.Reason}");
            }
        }
    }
}

