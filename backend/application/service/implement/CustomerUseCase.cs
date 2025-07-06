using DTO.CustomerDTO;
using aggregates.Customer;
using Repositories.CustomerRepository;

public class CustomerUseCase : ICustomersUseCase
{
    private readonly ICustomerRepository _repository;

    public CustomerUseCase(ICustomerRepository repository)
    {
        _repository = repository;
    }

    public async Task<CustomerDTO?> LoginAsync(LoginRequest request)
    {
        var customer = await _repository.GetCustomerByEmailAsync(request.Email);
        if (customer == null || !customer.ValidatePassword(request.Password))
            return null;

        return new CustomerDTO
        {
            Id = customer.Id,
            Name = customer.Name,
            Email = customer.Email,
            Type = customer.Type.ToString()
        };
    }

    // Các hàm khác...
}
