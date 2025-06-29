namespace entities.Ingredient
{
    public class Ingredient
    {
        public Guid Id { get; set; }

        public  string? Name { get; private set; }

        public string? Type { get; private set; } // topping or base ingredient
        public  string? Unit { get; private set; } // e.g., "ml", "g", "kg", "oz"

        public double CostPerUnit { get; private set; } = 0.0; // Cost per unit of the ingredient

        public double Quantity { get; private set; } = 0.0; // Current quantity of the ingredient in stock
        public bool IsAvailable { get; private set; } = true; // Indicates if the ingredient is currently available
    }
}