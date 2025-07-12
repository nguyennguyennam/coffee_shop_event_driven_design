using backend.application.Models;
using backend.application.interfaces.command;
using Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;
// Ensure the correct Order type is used for DbContext

namespace backend.infrastructure.command 
{
    public class OrderCommand : IOrderCommand
    {
        private readonly AppDbContext _context;

        public OrderCommand(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }
        public async Task<Order> CreateOrderAsync(Order order)
        {
            var entry = await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
            return entry.Entity;
        }
    }    
}