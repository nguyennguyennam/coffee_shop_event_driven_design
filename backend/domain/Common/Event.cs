/*
    This file is used to declare the structure of the Events
*/

namespace backend.domain.Common.Event
{
    public abstract class Event
    {
        public Guid EventId { get; private set; } = Guid.NewGuid();
        public int EventVersion { get; set; }

        public DateTime Occured { get; private set; } = DateTime.UtcNow;
        
        protected Event() {}
    }
}
