using entities.OrderItem;

namespace ValueObjects.OrderPrice
{
    public static class OrderPrice
    {
        public static double CalculateOrderPrice(List<OrderItem> orderItems)
        {
            double total = 0.0;
            foreach (var item in orderItems)
            {
                if (item.DrinkOrder == null)
                {
                    throw new ArgumentException("DrinkOrder cannot be null for an OrderItem.", nameof(item.DrinkOrder));
                }
                total += item.DrinkOrder.Price * item.Quantity;
            }
            return total;
        }
    }
}