using Confluent.Kafka;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace backend.infrastructure.Messaging
{
    public class KafkaEventPublish
    {
        private readonly IProducer<Null, string> _producer;

        public KafkaEventPublish(string bootstrapServer, string topic)
        {
            var config = new ProducerConfig
            {
                BootstrapServers = bootstrapServer,
                Acks = Acks.All,
                MessageTimeoutMs = 5000
            };

            _producer = new ProducerBuilder<Null, string>(config).Build();
        }

        public async Task PublishAsync<T>(string _topic, T @event)
        {
            var json = JsonSerializer.Serialize(@event, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            });

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

