using Confluent.Kafka;
using System;
using System.Threading;

public class KafkaEventSubscribe
{
    public static void Main(string[] args)
    {
        var config = new ConsumerConfig
        {
            BootstrapServers = "localhost:9092", // ✅ Sửa dấu cách
            GroupId = "order-service",
            AutoOffsetReset = AutoOffsetReset.Earliest
        };

        using var consumer = new ConsumerBuilder<Ignore, string>(config).Build();
        consumer.Subscribe("order-events");

        Console.WriteLine("⏳ Listening for messages on 'order-events'...");

        while (true)
        {
            try
            {
                var result = consumer.Consume(CancellationToken.None);
                Console.WriteLine($"✅ Received: {result.Message.Value}");
            }
            catch (ConsumeException e)
            {
                Console.WriteLine($"⚠️ Kafka error: {e.Error.Reason}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Unexpected error: {ex.Message}");
            }
        }
    }
}
