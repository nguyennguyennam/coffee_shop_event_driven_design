/**
    This file will setup the Kafka partitions for the messaging system.
    It includes the necessary configurations and methods to ensure that messages are published correctly to the specified Kafka partitions of the topic.

    Scenario:
    N orders are created, whereas M shipers are available.
    Each order is assigned to a shipper based on the partitioning strategy.
    Read partitions from the app setting.json
**/
using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Linq;

namespace backend.infrastructure.Messaging
{
    public class KafkaPartitionSetUp
    {

        public static async Task CreateTopicWithParitionsAsync(string bootstrapServers, string topicName, int numPartitions)
        {
            using (var adminClient = new AdminClientBuilder(new AdminClientConfig { BootstrapServers = bootstrapServers }).Build())
            {
                try
                {
                    await adminClient.CreateTopicsAsync(new TopicSpecification[] {
                        new TopicSpecification
                        {
                            Name = topicName,
                            NumPartitions = numPartitions,
                            ReplicationFactor = 1, // Assuming single broker for simplicity
                        }
                    });
                }
                catch (CreateTopicsException e)
                {
                    Console.WriteLine($"Failed to create topic {topicName}: {e.Results.FirstOrDefault()?.Error.Reason}", e);
                }
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
                Console.WriteLine($"Error while getting partitions: {ex.Message}");
                return new List<TopicPartition>();
            }
        }

    }
}