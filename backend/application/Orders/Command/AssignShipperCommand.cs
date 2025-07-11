namespace Application.Orders.Commands
{
    public class AssignShipperCommand
    {
        public Guid OrderId { get; set; }
        public Guid ShipperId { get; set; }
    }
}