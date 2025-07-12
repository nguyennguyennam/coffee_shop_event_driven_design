using Confluent.Kafka;
using System;
using System.Threading;
using System.Threading.Tasks;

public class KafkaEventSubscribe
{
    private readonly ConsumerConfig _config;

    public KafkaEventSubscribe()
    {
        _config = new ConsumerConfig
        {
            BootstrapServers = "localhost:9092",
            GroupId = "order-service",
            AutoOffsetReset = AutoOffsetReset.Earliest
        };
    }

    public async Task StartListeningAsync(CancellationToken cancellationToken = default)
    {
        using var consumer = new ConsumerBuilder<Ignore, string>(_config).Build();
        consumer.Subscribe("order-events");

        Console.WriteLine("⏳ Listening for messages on 'order-events'...");

        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                var result = consumer.Consume(cancellationToken);
                Console.WriteLine($"✅ Received: {result.Message.Value}");
            }
            catch (ConsumeException e)
            {
                Console.WriteLine($"⚠️ Kafka error: {e.Error.Reason}");
            }
            catch (OperationCanceledException)
            {
                Console.WriteLine("🛑 Listening cancelled.");
                break;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Unexpected error: {ex.Message}");
            }

            await Task.Delay(100); // Optional small delay
        }

        consumer.Close();
    }
}
