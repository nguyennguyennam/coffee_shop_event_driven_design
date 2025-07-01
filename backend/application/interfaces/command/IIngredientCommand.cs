using entities.Ingredient;

namespace interfaces.command
{
    public interface IIngredientCommand
    {
        Task<bool> UpdateIngredientQuantityAsync(Guid ingredientId, double quantityToDeduct);
    }
}