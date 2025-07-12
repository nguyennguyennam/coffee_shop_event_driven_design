using aggregates.Order;

namespace backend.domain.Repositories.IOrderRepository
{
    /*    List all of the methods that the OrderRepository should implement.
    This interface defines all of the contract methods, not the implementation.
    The implementation will be done in the Infrastructure layer.    
    */

    public interface IOrderAggregate
    {
        Task<OrderAggregate> GetByIdAsync(Guid AggregateId);
        Task SaveAsync(OrderAggregate order);
    }
}