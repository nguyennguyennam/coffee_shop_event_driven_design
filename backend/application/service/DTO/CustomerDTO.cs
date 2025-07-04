public class CreateCustomerDto
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public DateTime DateOfBirth { get; set; }
}

public class UpdateCustomerDto
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
}
