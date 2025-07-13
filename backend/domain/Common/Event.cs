/*
    This file is used to declare the structure of the Events
*/

using System.Text.Json.Serialization;
namespace backend.domain.Common.Event
{
    [JsonDerivedType(typeof(aggregates.Order.Events.OrderPlaced), typeDiscriminator: "OrderPlaced")]
    [JsonDerivedType(typeof(aggregates.Order.Events.OrderStatusUpdated), typeDiscriminator: "OrderStatusUpdated")]
    public abstract class Event
    {
        public Guid EventId { get; private set; } = Guid.NewGuid();
        public int EventVersion { get; set; }

        public DateTime Occured { get; private set; } = DateTime.UtcNow;

        protected Event() { }
    }
}
