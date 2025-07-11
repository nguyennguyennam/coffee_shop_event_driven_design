    using aggregates.Drink;

    namespace  backend.domain.Aggregates.Order
    {
    public class OrderItem
    {
        public Guid Id { get; private set; }

        public string DrinkName { get; private set; }

        public Guid DrinkId { get; private set; } // Unique identifier for the drink
        public int Quantity { get; private set; }
        public OrderItem(Guid drinkId, string drinkName, int quantity)
        {
            this.DrinkId = drinkId;
            this.DrinkName = drinkName;
            this.Quantity = quantity;
        }
        }
    }