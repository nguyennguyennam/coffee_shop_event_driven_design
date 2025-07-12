using Confluent.Kafka;
using System.Text.Json;
using System.Text.Json.Serialization;

public class KafkaEventPublish
{
    private readonly IProducer<Null, string> _producer;
    private readonly string _topic;

    public KafkaEventPublish(string bootstrapServer, string topic)
    {
        var config = new ProducerConfig
        {
            BootstrapServers = bootstrapServer,
            Acks = Acks.All, // đảm bảo gửi thành công tới Kafka
            MessageTimeoutMs = 5000
        };

        _producer = new ProducerBuilder<Null, string>(config).Build();
        _topic = topic;
    }

    public async Task PublishAsync<T>(T @event)
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

            Console.WriteLine($"✅ Sent event to Kafka: {result.TopicPartitionOffset}");
        }
        catch (ProduceException<Null, string> e)
        {
            Console.WriteLine($"❌ Kafka publish failed: {e.Error.Reason}");
        }
    }
}
