using aggregates.Drink;
using Repositories.DrinkRepository;

namespace service.usecase.implement
{
    public class DrinkUseCase : IDrinkUseCase
    {
        private readonly IDrinkRepository _drinkRepo;
        // private readonly IIngredientRepository _ingredientRepo;

        public DrinkUseCase(IDrinkRepository drinkRepo)
        {
            _drinkRepo = drinkRepo;
            //_ingredientRepo = ingredientRepo;
        }

        // public async Task<Drink> CreateDrinkAsync(CreateDrinkDto request)
        // {
        //     // B1: Chuẩn bị danh sách IngredientUsage (chỉ để ghi vào Drink_Ingredients, không gọi Consume)
        //     var ingredientUsages = new List<ValueObjects.IngredientUsage.IngredientUsage>();

        //     foreach (var usageDto in request.Ingredients)
        //     {
        //         var ingredient = await _ingredientRepo.GetIngredientByIdAsync(usageDto.IngredientId);
        //         if (ingredient == null)
        //             throw new Exception($"Ingredient with ID {usageDto.IngredientId} not found.");

        //         var usage = new ValueObjects.IngredientUsage.IngredientUsage(ingredient, usageDto.Quantity);
        //         ingredientUsages.Add(usage);
        //     }

        //     // B2: Dùng Factory tạo Drink (Factory sẽ tự tính giá và map IngredientUsage)
        //     var drink = DrinkFactory.CreateDrink(
        //         request.Name,
        //         request.Size,
        //         request.Description,
        //         request.Type,
        //         ingredientUsages
        //     );

        //     // B3: Lưu vào DB → EF Core sẽ tự ghi dữ liệu vào bảng Drink_Ingredients (vì dùng OwnsMany)
        //     await _drinkRepo.CreateDrinkAsync(drink);

        //     return drink;
        // }


        public async Task<List<Drink>> GetAllDrinksAsync()
        {
            return await _drinkRepo.GetAllDrinkAsync();
        }

        public async Task<Drink?> GetDrinkByIdAsync(Guid drinkId)
        {
            return await _drinkRepo.GetDrinkByIdAsync(drinkId);
        }
    }
}
