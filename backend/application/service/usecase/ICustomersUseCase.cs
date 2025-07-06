using aggregates.Customer;
using DTO.CustomerDTO;
public interface ICustomersUseCase
{
    Task<CustomerDTO?> LoginAsync(LoginRequest request);
}
