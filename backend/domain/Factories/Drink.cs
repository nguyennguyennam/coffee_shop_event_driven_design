using aggregates.Drink;
using ValueObjects.IngredientUsage;
namespace Factories
{
    public static class DrinkFactory
    {
        public static Drink CreateDrink
        (
            string Name,
            string Size,
            string Description,
            string Type,
            List<IngredientUsage> ingredient,
            bool IsAvailable
        )
        {
            if (string.IsNullOrWhiteSpace(Name) || string.IsNullOrWhiteSpace(Size) || string.IsNullOrWhiteSpace(Type))
            {
                throw new ArgumentException("Name, Size, and Type cannot be null or empty.");
            }
            if (ingredient == null || ingredient.Count == 0)
            {
                throw new ArgumentException("Ingredient usages cannot be null or empty, and each ingredient must have a valid quantity.", nameof(ingredient));
            }

            var drink = new Drink (Name, Size, Description, Type, ingredient, IsAvailable);
            return drink;
        }
    }
}