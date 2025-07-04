using entities.Voucher;
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
        public async Task<Voucher> CheckAndUpdateVoucherAsync(Guid Voucherid)
        {
            var voucher = await _context.Vouchers.FindAsync(Voucherid);
            if (voucher == null || voucher.IsUsed || voucher.ExpirationDate < DateTime.Today)
                throw new Exception("Wrong Voucher, isUsed or expired ");
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
