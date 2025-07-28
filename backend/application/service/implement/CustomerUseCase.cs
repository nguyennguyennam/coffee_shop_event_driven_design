using DTO.CustomerDTO;
using Repositories.CustomerRepository;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using service.helper;

public class CustomerUseCase : ICustomersUseCase
{
    private readonly ICustomerRepository _repository;
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CustomerUseCase(ICustomerRepository repository, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
    {
        _repository = repository;
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<CustomerDTO?> GetCurrentCustomerAsync()
    {
        var user = _httpContextAccessor.HttpContext?.User;
        if (user == null || !user.Identity?.IsAuthenticated == true)
            return null;

        var email = user.FindFirstValue(ClaimTypes.Email); // hoặc "email" nếu custom claim
        if (string.IsNullOrEmpty(email))
            return null;

        var customer = await _repository.GetCustomerByEmailAsync(email);
        if (customer == null)
            return null;

        return new CustomerDTO
        {
            Id = customer.Id,
            Name = customer.Name,
            Email = customer.Email,
            Type = customer.Type.ToString(),
            Token = null // hoặc có thể lấy lại token nếu cần
        };
    }

    public async Task<CustomerDTO?> LoginAsync(LoginRequest request)
    {
        var customer = await _repository.GetCustomerByEmailAsync(request.Email);
        if (customer == null || !customer.ValidatePassword(request.Password))
            return null;

        var token = JwtTokenHelper.GenerateToken(customer, _configuration["Jwt:Key"]!);
        
        return new CustomerDTO
        {
            Id = customer.Id,
            Name = customer.Name,
            Email = customer.Email,
            Type = customer.Type.ToString(),
            Token = token
        };
    }

    // Các hàm khác...
}
