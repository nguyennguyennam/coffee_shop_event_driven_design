using DTO.CustomerDTO;
using Repositories.CustomerRepository;
using service.helper;

public class CustomerUseCase : ICustomersUseCase
{
    private readonly ICustomerRepository _repository;
    private readonly IConfiguration _configuration;

    public CustomerUseCase(ICustomerRepository repository, IConfiguration configuration)
    {
        _repository = repository;
        _configuration = configuration;
        
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
