using backend.domain.Aggregates.Voucher;
namespace interfaces.command
{
    public interface IVoucherCommand
    {
        Task<Voucher> CreateVoucherAsync(Voucher voucher);
        Task<Voucher?> CheckAndUpdateVoucherAsync(string Code);
        
        Task<bool> DeleteVoucherAsync(Guid voucherId);
    }
}