using entities.Voucher;
namespace interfaces.command
{
    public interface IVoucherCommand
    {
        Task<Voucher> CreateVoucherAsync(Voucher voucher);
        Task<Voucher> CheckAndUpdateVoucherAsync(Guid voucherId);
        
        Task<bool> DeleteVoucherAsync(Guid voucherId);
    }
}