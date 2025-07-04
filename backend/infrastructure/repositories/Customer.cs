using aggregates.Customer;
using Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;
using Repositories.CustomerRepository;

namespace Infrastructure.Repositories.CustomerRepository
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly AppDbContext _context;

        public CustomerRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        /**
         * Retrieves all customers from the database.
         * @return A list of all Customer entities.
         */
        public async Task<List<Customer>> GetAllCustomersAsync()
        {
            return await _context.Customers.ToListAsync();
        }

        /**
         * Retrieves a customer by their unique identifier.
         * @param customerId The GUID of the customer to retrieve.
         * @return The Customer entity if found; otherwise, null.
         */
        public async Task<Customer?> GetCustomerByIdAsync(Guid customerId)
        {
            return await _context.Customers.FindAsync(customerId);
        }

        /**
         * Creates a new customer and saves it to the database.
         * @param customer The Customer entity to create.
         * @return The newly created Customer entity.
         */
        public async Task<Customer> CreateCustomerAsync(Customer customer)
        {
            var entry = await _context.Customers.AddAsync(customer);
            await _context.SaveChangesAsync();
            return entry.Entity;
        }

        /**
         * Updates an existing customer in the database.
         * @param customer The updated Customer entity.
         * @return The updated Customer entity.
         * @throws KeyNotFoundException if the customer does not exist.
         */
        public async Task<Customer> UpdateCustomerAsync(Customer customer)
        {
            var existingCustomer = await _context.Customers.FindAsync(customer.Id);
            if (existingCustomer == null)
            {
                throw new KeyNotFoundException("Customer not found.");
            }

            _context.Entry(existingCustomer).CurrentValues.SetValues(customer);
            await _context.SaveChangesAsync();
            return existingCustomer;
        }

        /**
         * Deletes a customer from the database by ID.
         * @param customerId The ID of the customer to delete.
         * @return True if deletion succeeded; otherwise, false.
         */

        /**
         * Retrieves customers based on their type (e.g., Regular, Premium).
         * @param type The CustomerType to filter by.
         * @return A list of customers matching the specified type.
         */
        public async Task<List<Customer>> GetCustomersByTypeAsync(CustomerType type)
        {
            return await _context.Customers
                .Where(c => c.Type == type)
                .ToListAsync();
        }

        /**
         * Updates the customer type (e.g., from Regular to Premium).
         * @param customerId The ID of the customer to update.

         * @return True if update succeeded; otherwise, false.
         */
        public async Task<bool> UpdateCustomerTypeAsync(Guid customerId)
        {
            var customer = await GetCustomerByIdAsync(customerId);
            if (customer == null)
            {
                throw new Exception("customer not found");
            }
            customer.UpgradeToPremium(); // assuming you have this method
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
