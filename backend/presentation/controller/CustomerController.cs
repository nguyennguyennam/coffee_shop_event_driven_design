using Microsoft.AspNetCore.Mvc;
using DTO;
using service.usecase;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ICustomersUseCase _customersUseCase;

        public LoginController(ICustomersUseCase customersUseCase)
        {
            _customersUseCase = customersUseCase;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var customer = await _customersUseCase.LoginAsync(request);

            if (customer == null)
                return Unauthorized(new { message = "Invalid email or password" });

            return Ok(customer);
        }
    }
}
