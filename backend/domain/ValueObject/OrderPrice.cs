using entities.OrderItem;
using entities.Voucher;


namespace ValueObjects.OrderPrice
{
    public static class OrderPrice
    {
        public static double CalculateOrderPrice(List<OrderItem> orderItems, Voucher? voucher = null )
        {
            double total = 0.0;

            foreach (var item in orderItems)
            {
                if (item.DrinkOrder == null)
                    throw new ArgumentException("DrinkOrder cannot be null for an OrderItem.", nameof(item.DrinkOrder));

                total += item.DrinkOrder.Price * item.Quantity;
            }

            if (voucher?.DiscountAmount != null)
            {
                var discount = voucher.DiscountAmount.Value; 
                total *= (1 - discount); 
            }

            return total;
        }
    }
}
