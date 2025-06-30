using aggregates.Order;

namespace backend.domain.Repositories.IOrderRepository
{
    /*    List all of the methods that the OrderRepository should implement.
    This interface defines all of the contract methods, not the implementation.
    The implementation will be done in the Infrastructure layer.    
    */

    public interface IOrderRepository
    {
        Task<List<Order>> GetAllOrdersAsync();
        Task<Order?> GetOrderByIdAsync(Guid id);
        Task<Order> CreateOrderAsync(Order order);
        Task<Order> UpdateOrderAsync(Order order);
        Task<List<Order>> GetOrderByCustomerIdAsync(Guid customerId);
        Task<List<Order>> GetOrdersByStatusAsync(string status);
    }
}