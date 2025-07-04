using aggregates.Drink;
using ValueObjects.IngredientUsage;

namespace Factories.DrinkFactory
{
    /// <summary>
    /// Factory class responsible for creating Drink aggregates with stock deduction logic.
    /// </summary>
    public static class DrinkFactory
    {
        /**
         * Creates a new Drink aggregate and deducts the corresponding ingredient quantities from inventory.
         * If any ingredient is unavailable, the drink is marked as unavailable.
         */
        public static Drink CreateDrink(
            string Name,
            string Size,
            string Description,
            string Type,
            List<IngredientUsage> ingredient,
            string image,
            bool IsAvailable = true
)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(Name) || string.IsNullOrWhiteSpace(Size) || string.IsNullOrWhiteSpace(Type))
                throw new ArgumentException("Name, Size, and Type cannot be null or empty.");

            if (ingredient == null || ingredient.Count == 0)
                throw new ArgumentException("Ingredient usages cannot be null or empty.", nameof(ingredient));
            if (image == null)
            {
                throw new ArgumentException("Image is not available");
            }

            // Loop through ingredients
            foreach (var usage in ingredient)
            {
                if (usage.Ingredient == null)
                    throw new ArgumentException("Ingredient in usage cannot be null.");

                // If any ingredient is unavailable, mark the drink unavailable
                if (!usage.Ingredient.IsAvailable)
                    IsAvailable = false;

                // Consume quantity from stock
                usage.Ingredient.Consume(usage.Quantity);
            }

            // Create and return the drink
            var drink = new Drink(Name, Size, Description, Type, ingredient,image,IsAvailable);
            return drink;
        }
    }
}
