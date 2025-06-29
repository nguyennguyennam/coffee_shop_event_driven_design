// Update the namespace below to the correct one where IngredientUsage is defined
using ValueObjects.IngredientUsage;

namespace ValueObjects.DrinkPrice
{
    public static class DrinkPrice
    {
        public static double CalculatePrice(List<IngredientUsage.IngredientUsage> usages)
        {
            double total = 0.0;
            foreach (var usage in usages)
            {
                if (usage.Ingredient != null)
                {
                    total += usage.Ingredient.CostPerUnit * usage.Quantity;
                }
            }
            return total * 1.5; // 50% markup
        }
    }
}
