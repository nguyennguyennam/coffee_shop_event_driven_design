using Infrastructure.DBContext;
using interfaces.command;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Commands.IngredientCommand
{
    public class IngredientCommandService : IIngredientCommand
    {
        private readonly AppDbContext _context;

        public IngredientCommandService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> UpdateIngredientQuantityAsync(Guid ingredientId, double quantityToDeduct)
        {
            var ingredient = await _context.Ingredients.FindAsync(ingredientId);
            if (ingredient == null || !ingredient.IsAvailable || ingredient.Quantity < quantityToDeduct)
                return false;

            ingredient.Consume(quantityToDeduct); 
            _context.Ingredients.Update(ingredient);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
