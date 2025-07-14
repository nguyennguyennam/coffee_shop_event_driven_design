
using DTO.PendingOrderDTO; // Replace 'YourNamespace.DTOs' with the actual namespace where PendingOrderDTO is defined

public interface IShipperOrderQuery
{
    Task<List<PendingOrderDTO>> GetPendingOrdersAsync();
}
