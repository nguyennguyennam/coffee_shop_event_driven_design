using backend.domain.Aggregates.Voucher;
using interfaces.command;
using Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Commands
{
    public class VoucherCommand : IVoucherCommand
    {
        private readonly AppDbContext _context;

        public VoucherCommand(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        /**
         * Creates a new voucher and saves it to the database.
         */
        public async Task<Voucher> CreateVoucherAsync(Voucher voucher)
        {
            var entry = await _context.Vouchers.AddAsync(voucher);
            await _context.SaveChangesAsync();
            return entry.Entity;
        }

        /**
         * Updates an existing voucher.
         */

        /**
         * Marks all vouchers with expiration date before today as expired (IsUsed = true).
         */
        public async Task<Voucher?> CheckAndUpdateVoucherAsync(string Code_) // Method returns Voucher or null
        {
            // Log the incoming voucher code
            Console.WriteLine($"The code_ is: {Code_}");

            // Find the voucher in the database by its code
            var voucher = await _context.Vouchers.FirstOrDefaultAsync(o => o.Code == Code_);

            // If voucher not found, return null
            if (voucher == null)
            {
                Console.WriteLine($"Voucher NOT found for code: {Code_}. Returning null.");
                return null;
            }

            Console.WriteLine($"Voucher found: ID={voucher.Id}, Code={voucher.Code}, IsUsed={voucher.IsUsed}, ExpirationDate={voucher.ExpirationDate}");

            if (voucher.IsUsed || voucher.ExpirationDate < DateTime.Today)
            {
                Console.WriteLine($"Voucher '{Code_}' is used or expired. Returning null.");
                return null;
            }

            voucher.MarkAsUsed();

            _context.Vouchers.Update(voucher);
            await _context.SaveChangesAsync();

            return voucher;
        }

        /**
         * Deletes a voucher from the database by its ID.
         */
        public async Task<bool> DeleteVoucherAsync(Guid voucherId)
        {
            var voucher = await _context.Vouchers.FindAsync(voucherId);
            if (voucher == null) return false;

            _context.Vouchers.Remove(voucher);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
