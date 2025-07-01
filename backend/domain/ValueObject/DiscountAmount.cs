
using Microsoft.EntityFrameworkCore;

namespace ValueObjects.DiscountAmount
{
    [Owned]
    public sealed class DiscountAmount
    {
        public double Value { get; }
        public static readonly DiscountAmount Low = new(0.05);
        public static readonly DiscountAmount High = new(0.07);

        public DiscountAmount() { } // Default constructor for EF Core

        public DiscountAmount(double Value)
        {
            if (Value < 0 || Value > 1)
            {
                throw new ArgumentOutOfRangeException(nameof(Value), "Discount amount must be between 0 and 1.");
            }
            this.Value = Value;
        }
    }
}