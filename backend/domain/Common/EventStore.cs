/*
    Declare interface for Events class used in another class 
*/

using backend.domain.Common.Event;
public interface IEventStore
{
    Task SaveEvents(Guid AggregateId, IEnumerable<Event> events, int expectedVersion);
    List<Event> GetEventsForAggregate(Guid AggregateId);
}


