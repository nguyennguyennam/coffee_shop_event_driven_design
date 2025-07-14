using backend.application.Payments.Command;
using backend.domain.Aggregates.Payment;
using backend.domain.Repositories.IPaymentRepository;

namespace backend.application.Payments.Handlers
{
    public class CreatePaymentHandler
    {
        private readonly IPaymentRepository _paymentRepository;

        public CreatePaymentHandler(IPaymentRepository paymentRepository)
        {
            _paymentRepository = paymentRepository;
        }

        public async Task<Payment> Handle(CreatePaymentCommand command)
        {
            var payment = new Payment(
                command.PaymentId,
                command.OrderId,
                command.Amount,
                command.Method,
                command.ReturnUrl,
                command.IpAddress);

            return await _paymentRepository.AddAsync(payment);
        }
    }
}