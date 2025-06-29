using aggregates.Drink;

namespace Repositories.DrinkRepository
{
    /*
    List all of the methods that the DrinkRepository should implement.
    This interface defines all of the contract methods, not the implementation.
    The implementation will be done in the Infrastructure layer.    
    */

    public interface IDrinkRepository
    {
        Task<List<Drink>> GetAllDrinkAsync();
        Task<Drink?> GetDrinkByIdAsync(Guid id);

        Task<Drink> CreateDrinkAsync(Drink drink);

        Task<List<Drink>> GetDrinkIsAvailableAsync(List<Drink> drinks);

        Task<Drink> UpdateDrinkAsync(Drink drink);

        Task<bool> DeleteDrinkAsync(Guid id);

    }
}