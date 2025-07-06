using aggregates.Order;
using BCrypt.Net;
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
        public string? Password { get; private set; }

        public Customer(Guid id, string name, string email, DateTime dateOfBirth, CustomerType type, string password)
        {
            Id = id;
            Name = name;
            Email = email;
            DateOfBirth = dateOfBirth;
            Type = type;
            Password = password;
        }

        public void UpgradeToPremium()
        {
            if (this.Type == CustomerType.Regular)
            {
                this.Type = CustomerType.Premium;
            }
        }
        public bool ValidatePassword(string plainPassword)
        {
            return BCrypt.Net.BCrypt.Verify(plainPassword, Password);
        }
    }
}