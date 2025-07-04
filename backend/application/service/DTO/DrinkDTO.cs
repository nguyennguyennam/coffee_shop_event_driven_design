namespace DTO.DrinkDTO
{
    public class CreateDrinkDto
    {
        public string Name { get; set; } = null!;
        public string Size { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Type { get; set; } = null!;
        public List<IngredientUsageDto> Ingredients { get; set; } = new();
    }

    public class IngredientUsageDto
    {
        public Guid IngredientId { get; set; }
        public double Quantity { get; set; }
    }
}
