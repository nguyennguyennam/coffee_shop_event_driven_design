using backend.domain.Aggregates.Payment;
using Infrastructure.Services;

namespace service.usecase.IPaymentUseCase
{
    public interface IPaymentUseCase
    {
        Task<string> CreatePaymentUrlAsync(Guid orderId, decimal amount, string returnUrl, string ipAddress);
        Task<Payment> ProcessVNPayCallbackAsync(IQueryCollection queryParams);
        Task<Payment?> GetPaymentByIdAsync(Guid paymentId);
        Task<Payment?> GetPaymentByOrderIdAsync(Guid orderId);
        Task<List<Payment>> GetAllPaymentsAsync();
    }
}