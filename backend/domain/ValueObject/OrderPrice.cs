using entities.Voucher;


namespace ValueObjects.OrderPrice
{
    public static class OrderPrice
    {
        public static double CalculateOrderPrice(double price, Voucher? voucher = null )
        {
            double total = 0.0;

            if (voucher?.DiscountAmount != null)
            {
                var discount = voucher.DiscountAmount.Value; 
                total = price * (1 - discount); 
            }
            return total;
        }
    }
}
