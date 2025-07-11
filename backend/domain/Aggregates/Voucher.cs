using ValueObjects.DiscountAmount;
namespace entities.Voucher
{
    public class Voucher
    {
        public Guid Id { get; private set; }

        public string? Code { get; set; }

        public DateTime ExpirationDate { get; private set; } // Date when the voucher expires
        public string? Description { get; private set; } // Description of the voucher

        public DiscountAmount? DiscountAmount { get; private set; } // Discount amount associated with the voucher

        public bool IsUsed { get; private set; } = false; // Indicates if the voucher is currently active

        public Voucher() { } // Default constructor for EF Core

        public void MarkAsUsed()
        {
            this.IsUsed = true;
        }

    }
}