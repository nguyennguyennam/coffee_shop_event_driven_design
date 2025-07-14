using backend.domain.Aggregates.Payment;

namespace backend.domain.Repositories.IPaymentRepository
{
    public interface IPaymentRepository
    {
        Task<Payment?> GetByIdAsync(Guid id);
        Task<Payment?> GetByOrderIdAsync(Guid orderId);
        Task<Payment?> GetByVNPayTransactionIdAsync(string transactionId);
        Task<List<Payment>> GetAllAsync();
        Task<Payment> AddAsync(Payment payment);
        Task UpdateAsync(Payment payment);
        Task DeleteAsync(Guid id);
    }
}