using backend.application.Models;

namespace backend.application.interfaces.queries
{
    public interface IOrderQuery
    {
        Task<List<Order>> GetAllOrdersAsync();
        Task<Order?> GetOrderByIdAsync(Guid id);
        Task<List<Order>> GetOrderByCustomerIdAsync(Guid customerId);
        Task<List<Order>> GetOrdersByStatusAsync(string status);
        Task<int> CountOrderByCustomerId(Guid customerId);
    }
}