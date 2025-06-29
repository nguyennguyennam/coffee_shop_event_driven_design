using aggregates.Order;
namespace aggregates.Customer
{
    // Enum for customer types
    public enum CustomerType
    {
        Regular,
        Premium
    }
    public class Customer
    {
        public Guid Id { get; private set; } // Unique identifier for the customer
        public string? Name { get; private set; }

        public string? Email { get; private set; }

        public DateTime DateOfBirth { get; private set; } //Date of Birth
        public CustomerType Type { get; private set; }// Type of customer (e.g., Regular, Premium)
    }
}