/*
    This file is used to declare the structure of the Events
*/
using System.Text.Json.Serialization; 


namespace backend.domain.Common.Event
{
    public abstract class Event
    {
        public Guid EventId { get; private set; } = Guid.NewGuid();
        public int EventVersion { get; set; }

        public DateTime Occured { get; private set; } = DateTime.UtcNow;

        protected Event() { }
        [JsonPropertyName("$type")]
        public string EventType => GetType().Name;
    }
}
