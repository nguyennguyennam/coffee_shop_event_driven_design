// /*
//     This file is used to implement the Order repository in the domain layer.
//     It contains the methods to interact with the Order aggregate.
// */

// using aggregates.Order;
// using backend.domain.Repositories.IOrderRepository;
// using Microsoft.EntityFrameworkCore;
// using Infrastructure.DBContext;

// namespace Infrastructure.Repositories.OrderRepository
// {
//     public class OrderRepository : IOrderRepository
//     {
//         private readonly AppDbContext _context;

//         public Task<List<Order>> GetAllOrdersAsync()
//         {
//             return _context.Orders.ToListAsync();
//         }
//         public  Task<Order?> GetOrderByIdAsync(Guid id)
//         {

//         }
//         public Task<Order> CreateOrderAsync(Order order)
//         {

//         }
//     }
// }