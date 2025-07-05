using entities.Voucher;


namespace ValueObjects.OrderPrice
{
    public static class OrderPrice
    {
        public static double CalculateOrderPrice(double price, Voucher? voucher = null)
        {

            if (voucher?.DiscountAmount != null)
            {
                var discount = voucher.DiscountAmount.Value;
                return price * (1 - discount);
            }
            else
            {
                return price;
            }    
        }
    }
}
