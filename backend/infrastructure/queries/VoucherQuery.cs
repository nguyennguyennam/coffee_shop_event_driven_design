using backend.domain.Aggregates.Voucher;
using Infrastructure.DBContext;
using interfaces.queries;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Queries
{
    public class VoucherQueryService : IVoucherQueryService
    {
        private readonly AppDbContext _context;

        /** 
         * Initializes a new instance of the VoucherQueryService class.
         * @param context The application's database context.
         */
        public VoucherQueryService(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        /** 
         * Retrieves all vouchers from the database.
         * @return A list of all Voucher entities.
         */
        public async Task<List<Voucher>> GetAllVoucherAsync()
        {
            return await _context.Vouchers.ToListAsync();
        }
    }
}
