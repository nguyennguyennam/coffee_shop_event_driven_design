using aggregates.Order;
using backend.domain.Repositories.IOrderRepository;
using Microsoft.EntityFrameworkCore;
using Infrastructure.DBContext;

namespace Infrastructure.Repositories.OrderRepository
{
    public class OrderRepository : IOrderRepository
    {
        // This code defines a OrderRepository class that implements the IOrderRepository interface.
        private readonly AppDbContext _context;

        public OrderRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        /**
         * Retrieves all orders from the database.
         * @return A list of all Order entities.
         */
        public async Task<List<Order>> GetAllOrdersAsync()
        {
            return await _context.Orders.Include(o => o.OrderItems).ToListAsync();
        }

        /**
         * Retrieves a single order by its unique identifier.
         * @param id The ID of the order to retrieve.
         * @return The Order entity if found, otherwise null.
         */
        public async Task<Order?> GetOrderByIdAsync(Guid id)
        {
            return await _context.Orders.Where(o => o.Id == id).Include(o => o.OrderItems).FirstOrDefaultAsync();
        }

        /**
         * Adds a new order to the database.
         * @param order The Order entity to be created.
         * @return The created Order entity.
         */
        public async Task<Order> CreateOrderAsync(Order order)
        {
            var entry = await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
            return entry.Entity;
        }


        
        /**
         * Retrieves all orders placed by a specific customer.
         * @param customerId The unique identifier of the customer.
         * @return A list of Order entities associated with the customer.
         */
        public async Task<List<Order>> GetOrderByCustomerIdAsync(Guid customerId)
        {
            return await _context.Orders.Where(o => o.CustomerId == customerId).ToListAsync();
        }

        /**
         * Retrieves all orders that have a specific status.
         * @param status The status to filter orders by.
         * @return A list of Order entities matching the given status.
         */
        public async Task<List<Order>> GetOrdersByStatusAsync(string status)
        {
            return await _context.Orders.Where(o => o.Status == status).ToListAsync();
        }

        public async Task<int> CountOrderByCustomerId(Guid customerId)
        {
            return await _context.Orders.Where(o => o.CustomerId == customerId).CountAsync();
        }
    }
}
