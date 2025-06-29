
using ValueObjects.IngredientUsage;
using ValueObjects.DrinkPrice;
namespace aggregates.Drink
{
    public class Drink
    {
        public Guid Id { get; private set; }

        public string? Name { get; private set; }
        public string? Size { get; private set; }

        public string? Description { get; private set; }

        public string? Type { get; private set; } // e.g., "coffee", "tea", "smoothie", etc.

        public List<IngredientUsage> _ingredient = new(); // List of ingredients used in the drink
        public double Price { get; private set; } = 0.0; // Price of the drink
        public bool IsAvailable { get; private set; } = true; // Indicates if the drink is currently available

        public Drink() { } // Default constructor for EF Core
        //Constructor for the Drink class
        public Drink(
            string Name,
            string Size,
            string Description,
            string Type,
            List<IngredientUsage> ingredient,
            bool IsAvailable
        )
        {
            this.Name = Name;
            this.Size = Size;
            this.Description = Description;
            this.Type = Type;
            _ingredient.AddRange(ingredient);
            this.Price = DrinkPrice.CalculatePrice(ingredient);
            this.IsAvailable = IsAvailable;
        }
    }
}