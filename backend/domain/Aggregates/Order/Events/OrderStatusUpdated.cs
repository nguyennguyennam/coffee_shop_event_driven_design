using backend.domain.Common.Event;

namespace aggregates.Order.Events
{
    
    public class OrderStatusUpdated : Event
{
    public Guid OrderId { get; }
    public string NewStatus { get; }
    public Guid CustomerId { get; }
    public double TotalPrice { get; }
    public DateTime OrderDate { get; }

    public OrderStatusUpdated(Guid orderId, string newStatus, Guid customerId, double totalPrice, DateTime orderDate)
    {
        OrderId = orderId;
        NewStatus = newStatus;
        CustomerId = customerId;
        TotalPrice = totalPrice;
        OrderDate = orderDate;
    }
}
}