using Confluent.Kafka;
using Confluent.Kafka.Admin;

namespace backend.infrastructure.Messaging
{
    public class KafkaPartitionSetUp
    {
         public static async Task CreateTopicWithParitionsAsync(string bootstrapServers, string topicName, int numPartitions)
        {
            int currentPartitions = 0;
            using var adminClient = new AdminClientBuilder(new AdminClientConfig { BootstrapServers = bootstrapServers }).Build();

            try
            {
                var metadata = adminClient.GetMetadata(topicName, TimeSpan.FromSeconds(5));
                var topicMeta = metadata.Topics.FirstOrDefault(t => t.Topic == topicName);

                var topicExists = topicMeta != null && topicMeta.Error.Code == ErrorCode.NoError;

                if (topicMeta != null && topicMeta.Error.Code == ErrorCode.NoError && topicMeta.Partitions != null)
                {
                    currentPartitions = topicMeta.Partitions.Count;
                }

                if (!topicExists)
                {
                    await adminClient.CreateTopicsAsync(new[]
                    {
                        new TopicSpecification
                        {
                            Name = topicName,
                            NumPartitions = numPartitions,
                            ReplicationFactor = 1
                        }
                    });
                    return;
                }

                if (currentPartitions < numPartitions)
                {
                    await adminClient.CreatePartitionsAsync(new[]
                    {
                        new PartitionsSpecification
                        {
                            Topic = topicName,
                            IncreaseTo = numPartitions
                        }
                    });
                }
            }
            catch (CreateTopicsException e)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"[KafkaPartitionSetUp ERROR] Failed to create topic '{topicName}': {e.Results.FirstOrDefault()?.Error.Reason ?? e.Message}");
                Console.ResetColor();
            }
            catch (CreatePartitionsException e)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"[KafkaPartitionSetUp ERROR] Failed to increase partitions for topic '{topicName}': {e.Results.FirstOrDefault()?.Error.Reason ?? e.Message}");
                Console.ResetColor();
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"[KafkaPartitionSetUp ERROR] Unexpected error for '{topicName}': {ex.Message}");
                Console.ResetColor();
            }
        }

        public static List<TopicPartition> GetPartitions(string topicName, string bootstrapServers, int partitionStart, int partitionNums)
        {
            using var adminClient = new AdminClientBuilder(new AdminClientConfig { BootstrapServers = bootstrapServers }).Build();

            try
            {
                var metadata = adminClient.GetMetadata(topicName, TimeSpan.FromSeconds(10));
                var partitions = metadata.Topics.FirstOrDefault(t => t.Topic == topicName)?.Partitions;

                if (partitions == null)
                {
                    Console.WriteLine($"No partitions found for topic {topicName}");
                    return new List<TopicPartition>();
                }

                var topicPartitions = partitions
                    .Skip(partitionStart)
                    .Take(partitionNums)
                    .Select(p => new TopicPartition(topicName, p.PartitionId))
                    .ToList();

                return topicPartitions;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error while getting partitions for topic '{topicName}': {ex.Message}");
                return new List<TopicPartition>();
            }
        }
    }
}