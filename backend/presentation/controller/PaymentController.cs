using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using service.usecase.IPaymentUseCase;
using service.usecase.IOrderUseCase; // new using directive

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentUseCase _paymentUseCase;
        private readonly IOrderUseCase _orderUseCase; // new field

        // update constructor to accept IOrderUseCase
        public PaymentController(IPaymentUseCase paymentUseCase, IOrderUseCase orderUseCase)
        {
            _paymentUseCase = paymentUseCase;
            _orderUseCase = orderUseCase;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest request)
        {
            try
            {
                var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
                Console.WriteLine($"User: {request.userId}");
                var paymentUrl = await _paymentUseCase.CreatePaymentUrlAsync(
                    request.OrderId,
                    request.Amount,
                    request.ReturnUrl,
                    clientIp,
                    !string.IsNullOrEmpty(request.userId) ? Guid.Parse(request.userId) : Guid.Empty);

                return Ok(new { PaymentUrl = paymentUrl });
            }
            catch (DbUpdateException dbEx)
    {
        // in ra chi tiết inner exception
        var detail = dbEx.InnerException?.Message ?? dbEx.Message;
        return BadRequest(new { message = "EF save error", detail });
    }
    catch (Exception ex)
    {
        return BadRequest(new { message = ex.Message });
    }
        }

        [HttpGet("vnpay-return")]
        public async Task<IActionResult> VNPayReturn()
        {
            try
            {
                var payment = await _paymentUseCase.ProcessVNPayCallbackAsync(Request.Query);
                // If payment status is successful, update the corresponding order status to "Payment"
                if (payment.Status.ToString().Equals("Success", StringComparison.OrdinalIgnoreCase))
                {
                    await _orderUseCase.UpdateOrderAsync(
                        payment.OrderId,
                        "Payment",
                        payment.UserId != null ? payment.UserId : Guid.Empty
                    );
                }
                
                // Redirect to frontend with payment result
                var frontendUrl = "http://localhost:3000"; // Replace with your frontend URL
                var redirectUrl = $"{frontendUrl}/payment-result?orderId={payment.OrderId}&status={payment.Status}&transactionId={payment.VNPayTransactionId}";
                
                return Redirect(redirectUrl);
            }
            catch (Exception ex)
            {
                var frontendUrl = "http://localhost:3000";
                var redirectUrl = $"{frontendUrl}/payment-result?status=error&message={ex.Message}";
                return Redirect(redirectUrl);
            }
        }

        [HttpPost("vnpay-ipn")]
        public async Task<IActionResult> VNPayIPN()
        {
            try
            {
                await _paymentUseCase.ProcessVNPayCallbackAsync(Request.Query);
                return Ok(new { RspCode = "00", Message = "Success" });
            }
            catch (Exception)
            {
                return Ok(new { RspCode = "99", Message = "Failed" });
            }
        }

        [HttpGet("{paymentId}/status")]
        public async Task<IActionResult> GetPaymentStatus(Guid paymentId)
        {
            try
            {
                var payment = await _paymentUseCase.GetPaymentByIdAsync(paymentId);
                if (payment == null)
                {
                    return NotFound(new { message = "Payment not found" });
                }

                return Ok(new
                {
                    PaymentId = payment.AggregateId,
                    OrderId = payment.OrderId,
                    Status = payment.Status.ToString(),
                    TransactionId = payment.VNPayTransactionId,
                    Amount = payment.Amount,
                    CreatedAt = payment.CreatedAt,
                    ProcessedAt = payment.ProcessedAt
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetPaymentByOrderId(Guid orderId)
        {
            try
            {
                var payment = await _paymentUseCase.GetPaymentByOrderIdAsync(orderId);
                if (payment == null)
                {
                    return NotFound(new { message = "Payment not found for this order" });
                }

                return Ok(new
                {
                    PaymentId = payment.AggregateId,
                    OrderId = payment.OrderId,
                    Status = payment.Status.ToString(),
                    TransactionId = payment.VNPayTransactionId,
                    Amount = payment.Amount,
                    CreatedAt = payment.CreatedAt,
                    ProcessedAt = payment.ProcessedAt
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPayments()
        {
            try
            {
                var payments = await _paymentUseCase.GetAllPaymentsAsync();
                return Ok(payments.Select(p => new
                {
                    PaymentId = p.AggregateId,
                    OrderId = p.OrderId,
                    Status = p.Status.ToString(),
                    TransactionId = p.VNPayTransactionId,
                    Amount = p.Amount,
                    CreatedAt = p.CreatedAt,
                    ProcessedAt = p.ProcessedAt
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("refund")]
        public async Task<IActionResult> ProcessRefund([FromBody] RefundRequest request)
        {
            try
            {
                await _paymentUseCase.ProcessRefundAsync(request.OrderId, request.RefundReason);
                return Ok(new { message = "Refund processed successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    public class CreatePaymentRequest
    {
        public Guid OrderId { get; set; }
        public decimal Amount { get; set; }
        public string ReturnUrl { get; set; } = string.Empty;
        public string? userId { get; set; } // Optional user ID for tracking
    }

    public class RefundRequest
    {
        public Guid OrderId { get; set; }
        public string RefundReason { get; set; } = string.Empty;
    }
}
