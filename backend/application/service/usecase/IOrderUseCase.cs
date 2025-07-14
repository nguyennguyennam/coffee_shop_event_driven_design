using backend.application.Models;
using DTO.OrderDTO;

namespace service.usecase.IOrderUseCase
{
    public interface IOrderUseCase
    {
        Task<Order> CreateOrderAsync(CreateOrderDto request);
        Task<Order> GetOrderByIdAsync(Guid id);
        Task<List<Order>> GetAllOrderAsync();
        Task<List<Order>> GetOrdersByCustomerAsync(Guid customerId);
        Task<Order> UpdateOrderAsync(Guid OrderId, string newStatus);
    }
}