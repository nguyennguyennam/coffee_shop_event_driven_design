using backend.domain.Aggregates.Voucher;

namespace interfaces.queries
{
    public interface IVoucherQueryService
    {
        Task<List<Voucher>> GetAllVoucherAsync();
    }
}