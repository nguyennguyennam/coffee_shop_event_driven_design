using entities.OrderItem;
using DTO.OrderDTO;

namespace service.helper
{
    public static class OrderHelper
    {
        public static Task<List<OrderItem>> MapOrderItemList(List<OrderItemDTO> items)
        {
            var orderItems = new List<OrderItem>();
            foreach (var item in items)
            {
                var orderItem = new OrderItem(item.DrinkId, item.DrinkName ?? string.Empty, item.Quantity);
                orderItems.Add(orderItem);
            }
            return Task.FromResult(orderItems);
        }
    }
}