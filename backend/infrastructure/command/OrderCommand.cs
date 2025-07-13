using backend.application.Models;
using backend.application.interfaces.command;
using Infrastructure.DBContext;
using backend.infrastructure.Messaging;

// Ensure the correct Order type is used for DbContext

namespace backend.infrastructure.command
{
    public class OrderCommand : IOrderCommand
    {
        private readonly AppDbContext _context;
        private readonly KafkaEventSubscribe _kafka;

        public OrderCommand(AppDbContext context, KafkaEventSubscribe kafka)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _kafka = kafka;

            Task.Run(() => _kafka.StartListeningAsync(CreateOrderAsync));
        }
        public async Task<Order> CreateOrderAsync(Order order)
        {
            // Consume the order object and create a new order in the database
            
            var entry = await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
            Console.WriteLine("✅ Order saved to DB.");
            return entry.Entity;
        }
    }
}