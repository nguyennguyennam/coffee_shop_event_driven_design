using aggregates.Customer;

namespace Repositories.CustomerRepository
{
    public interface ICustomerRepository
    {
        Task<List<Customer>> GetAllCustomersAsync();
        Task<Customer?> GetCustomerByIdAsync(Guid customerId);

        Task<Customer> CreateCustomerAsync(Customer customer);
        Task<Customer> UpdateCustomerAsync(Customer customer);

        Task<List<Customer>> GetCustomersByTypeAsync(CustomerType type);
        Task<bool> UpdateCustomerTypeAsync(Guid customerId);
    }
}
