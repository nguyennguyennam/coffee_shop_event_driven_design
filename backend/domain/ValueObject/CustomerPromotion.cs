using aggregates.Customer;

namespace ValueObjects.CustomerPromotion
{
    public sealed class CustomerPromotion
    {
        public static double CalculateCustomerPromotion(CustomerType type)
        {
            return type switch
            {
                CustomerType.Premium => 0.04,
                CustomerType.Regular => 0.0,
                _ => 0.0
            };
        }
    }
}