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
            return total * 2.5; // 150% markup
        }
    }
}
