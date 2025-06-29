using entities.Ingredient;
using Humanizer;
namespace ValueObjects.IngredientUsage;

public class IngredientUsage
{
    public Guid IngredientId { get; private set; }

    public Ingredient? Ingredient { get; private set; } // Navigation property for EF Core
    public double Quantity
    { get; private set; }

    public IngredientUsage(Guid ingredientId, double quantity)
    {
        if (quantity <= 0)
            throw new ArgumentOutOfRangeException(nameof(quantity));
        IngredientId = ingredientId;
        Quantity = quantity;
    }

    // EF Core needs parameterless constructor
    private IngredientUsage() { }
}
