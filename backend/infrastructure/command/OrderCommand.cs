using backend.application.Models;
using backend.application.interfaces.command;
using Infrastructure.DBContext;
using backend.infrastructure.Messaging;

using Microsoft.EntityFrameworkCore;

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

        //Update order through Event Store db

        public async Task<Order> UpdateOrderAsync(Guid OrderId, string newStatus)
        {
            var affectedRows = await _context.Orders
                                     .Where(o => o.Id == OrderId)
                                     .ExecuteUpdateAsync(o => o.SetProperty(o_ => o_.Status, newStatus));

            if (affectedRows == 0)
            {
                Console.WriteLine($"⚠️ No order found with ID {OrderId} to update status.");
            }

            var updatedOrder = await _context.Orders.FindAsync(OrderId);

            if (updatedOrder == null)
            {
                throw new InvalidOperationException($"Order with ID {OrderId} not found after update.");
            }

            return updatedOrder;
        }
    }
}