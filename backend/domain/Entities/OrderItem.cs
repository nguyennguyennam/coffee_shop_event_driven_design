    using aggregates.Drink;

    namespace entities.OrderItem
    {
        public class OrderItem
        {
            public Guid Id { get; private set; }

            public  string? DrinkName { get; private set; }

            public Drink? DrinkOrder { get; private set; } // Navigation property for EF Core
            public Guid DrinkId { get; private set; } // Unique identifier for the drink
            public  int Quantity { get; private set; }
            
        }
    }