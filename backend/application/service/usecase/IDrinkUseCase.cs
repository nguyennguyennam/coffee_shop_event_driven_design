using aggregates.Drink;
using DTO.DrinkDTO;
namespace service.usecase
{
    public interface IDrinkUseCase
    {
        //Task<Drink> CreateDrinkAsync(CreateDrinkDto request);
        Task<List<Drink>> GetAllDrinksAsync();
        Task<Drink?> GetDrinkByIdAsync(Guid drinkId);
    }
}
