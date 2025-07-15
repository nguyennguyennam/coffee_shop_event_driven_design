using Microsoft.AspNetCore.Mvc;
using DTO.OrderDTO;
using backend.application.Models;
using service.usecase.IOrderUseCase;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderUseCase _orderUseCase;

        public OrderController(IOrderUseCase orderUseCase)
        {
            _orderUseCase = orderUseCase;
        }

        // POST: api/order
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto request)
        {
            try
            {
                var createdOrder = await _orderUseCase.CreateOrderAsync(request);
                return CreatedAtAction(nameof(GetOrderById), new { id = createdOrder.Id }, createdOrder);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/order
        [HttpGet]
        public async Task<ActionResult<List<Order>>> GetAllOrders()
        {
            var orders = await _orderUseCase.GetAllOrderAsync();
            return Ok(orders);
        }

        // GET: api/order/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrderById(Guid id)
        {
            var order = await _orderUseCase.GetOrderByIdAsync(id);
            if (order == null)
                return NotFound(new { message = $"Order with ID {id} not found." });

            return Ok(order);
        }


        //post:api/order/{orderId}/status

        [HttpPost("{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(Guid orderId, [FromBody] UpdateOrderStatusRequest request )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedOrder = await _orderUseCase.UpdateOrderAsync(orderId, request.NewStatus);

                if (updatedOrder == null)
                {
                    return NotFound(new ProblemDetails
                    {
                        Status = 404,
                        Title = "Order Not Found",
                        Detail = $"Order with ID {orderId} not found or could not be updated."
                    });
                }

                return Ok(new { message = $"Order status for {orderId} updated to {request.NewStatus}", order = updatedOrder });
            }
            catch (Exception ex)
            {
                var (statusCode, title, detail) = ex switch
                {
                    ArgumentNullException _ => (400, "Invalid Request", ex.Message),
                    InvalidOperationException _ => (400, "Operation Failed", ex.Message),
                    _ => (500, "Internal Server Error", "An unexpected error occurred.")
                };

                Console.Error.WriteLine($"Error in UpdateOrderStatus for Order ID {orderId}: {ex.Message}");

                return StatusCode(statusCode, new ProblemDetails
                {
                    Status = statusCode,
                    Title = title,
                    Detail = detail
                });
            }
        }

        // GET: api/order/customer/{customerId}
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetOrdersByCustomer(Guid customerId)
        {
            try
            {
            var orders = await _orderUseCase.GetOrdersByCustomerAsync(customerId);
            orders = orders.OrderByDescending(o => o.OrderDate).ToList();
            return Ok(orders);
            }
            catch (Exception ex)
            {
            return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/order/{orderId}/confirm
        [HttpPost("{orderId}/confirm")]
        public async Task<IActionResult> ConfirmOrder(Guid orderId)
        {
            try
            {
            // Update the order status to "Order Confirmed" in the database
            await _orderUseCase.UpdateOrderAsync(orderId, "Order Confirmed");
            // Publish the updated order event to the event store (and to Kafka, etc.)
            return Redirect("/order/{orderId}");
            }
            catch (Exception ex)
            {
            return BadRequest(new { message = ex.Message });
            }
        }
    }
}
