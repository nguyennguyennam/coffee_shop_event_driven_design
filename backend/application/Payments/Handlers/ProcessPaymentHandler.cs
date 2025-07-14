using backend.application.Payments.Command;
using backend.domain.Repositories.IPaymentRepository;

namespace backend.application.Payments.Handlers
{
    public class ProcessPaymentHandler
    {
        private readonly IPaymentRepository _paymentRepository;

        public ProcessPaymentHandler(IPaymentRepository paymentRepository)
        {
            _paymentRepository = paymentRepository;
        }

        public async Task Handle(ProcessPaymentCommand command)
        {
            var payment = await _paymentRepository.GetByIdAsync(command.PaymentId);
            if (payment == null)
            {
                throw new InvalidOperationException($"Payment with ID {command.PaymentId} not found.");
            }

            payment.ProcessPayment(
                command.VNPayTransactionId,
                command.ResponseCode,
                command.Status);

            await _paymentRepository.UpdateAsync(payment);
        }
    }
}
