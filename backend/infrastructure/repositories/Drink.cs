using aggregates.Drink;
using Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;
using Repositories.DrinkRepository;

namespace Infrastructure.Repositories.DrinkRepository
{
    // This code defines a DrinkRepository class that implements the IDrinkRepository interface.
    public class DrinkRepository : IDrinkRepository
    {
        private readonly AppDbContext _context;

        public DrinkRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        /**
         * Retrieves all drinks from the database.
         * @return A list of all Drink entities.
         */
        public async Task<List<Drink>> GetAllDrinkAsync()
        {
            return await _context.Drinks.ToListAsync();
        }

        /**
         * Retrieves a drink by its unique identifier.
         * @param id The GUID of the drink to retrieve.
         * @return The Drink entity if found; otherwise, null.
         */
        public async Task<Drink?> GetDrinkByIdAsync(Guid id)
        {
            return await _context.Drinks.FindAsync(id);
        }

        /**
         * Creates a new drink and adds it to the database.
         * @param drink The Drink entity to add.
         * @return The newly created Drink entity.
         */
        public async Task<Drink> CreateDrinkAsync(Drink drink)
        {
            var entry = await _context.Drinks.AddAsync(drink);
            await _context.SaveChangesAsync();
            return entry.Entity;
        }

        /**
         * Retrieves all drinks that are currently marked as available.
         * @param drinks A list of drinks to filter from.
         * @return A filtered list of available Drink entities.
         */
        public async Task<List<Drink>> GetDrinkIsAvailableAsync(List<Drink> drinks)
        {
            return await Task.FromResult(drinks.Where(d => d.IsAvailable).ToList());
        }

        /**
         * Updates an existing drink in the database.
         * @param drink The updated Drink entity.
         * @return The updated Drink entity.
         * @throws KeyNotFoundException if the drink does not exist.
         */
        public async Task<Drink> UpdateDrinkAsync(Drink drink)
        {
            var existingDrink = await _context.Drinks.FindAsync(drink.Id);
            if (existingDrink == null)
            {
                throw new KeyNotFoundException("Drink not found");
            }

            _context.Entry(existingDrink).CurrentValues.SetValues(drink);
            await _context.SaveChangesAsync();
            return existingDrink;
        }

        /**
         * Deletes a drink from the database by its identifier.
         * @param id The GUID of the drink to delete.
         * @return True if the deletion was successful; otherwise, false.
         */
        public async Task<bool> DeleteDrinkAsync(Guid id)
        {
            var drink = await _context.Drinks.FindAsync(id);
            if (drink == null)
            {
                return false;
            }

            _context.Drinks.Remove(drink);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
