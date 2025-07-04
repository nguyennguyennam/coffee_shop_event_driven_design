using aggregates.Order;
using DTO.OrderDTO;
using backend.domain.Repositories.IOrderRepository;
using Repositories.CustomerRepository;
using interfaces.command;
using service.usecase.IOrderUseCase;
using entities.Voucher;
using Factories.OrderFactory;
using entities.OrderItem;
using service.helper;
using Repositories.DrinkRepository;

namespace service.implement
{
    public class OrderUseCase : IOrderUseCase
    {
        private readonly IOrderRepository _orderRepo;
        private readonly ICustomerRepository _customerRepo;
        private readonly IVoucherCommand _voucherCommand;
        private readonly IIngredientCommand _iingredientCommand;
        private readonly IDrinkRepository _idrinkrepository;

        public OrderUseCase(IOrderRepository orderRepo, ICustomerRepository customerRepo, IVoucherCommand voucherCommand, IIngredientCommand iingredientCommand, IDrinkRepository idrinkRepository)
        {
            _orderRepo = orderRepo;
            _customerRepo = customerRepo;
            _voucherCommand = voucherCommand;
            _iingredientCommand = iingredientCommand;
            _idrinkrepository = idrinkRepository;
        }

        public async Task<Order> CreateOrderAsync(CreateOrderDto request)
        {
            Voucher? voucher = null;
            if (request.VoucherId.HasValue)
            {
                var voucherId = request.VoucherId.Value;

                voucher = await _voucherCommand.CheckAndUpdateVoucherAsync(voucherId);
            }
            List<OrderItem> items = await OrderHelper.MapOrderItemList(request.Items);

            var order = OrderFactory.CreateOrder(request.CustomerId, request.VoucherId, DateTime.UtcNow, "Payment", items, request.TotalPrice, voucher, request.customerType);
            foreach (var item in items)
            {
                var drink = await _idrinkrepository.GetDrinkByIdAsync(item.DrinkId);
                if (drink != null)
                {
                    foreach (var usage in drink._ingredient)
                    {
                        await _iingredientCommand.UpdateIngredientQuantityAsync(usage.IngredientId, usage.Quantity * item.Quantity);
                    }
                }
            }

            var totalOrder = await _orderRepo.CountOrderByCustomerId(request.CustomerId);
            if (totalOrder >= 20)
            {
                var customer = await _customerRepo.GetCustomerByIdAsync(request.CustomerId);
                if (customer != null)
                {
                    await _customerRepo.UpdateCustomerAsync(customer);
                }
            }
            return order;
        }

        public async Task<Order> GetOrderByIdAsync(Guid id)
        {
            var order = await _orderRepo.GetOrderByIdAsync(id);
            if (order == null)
            {
                throw new Exception("Order not found!");
            }
            return order;
        }

        public async Task<List<Order>> GetAllOrderAsync()
        {
            return await _orderRepo.GetAllOrdersAsync();
        }

        public async Task<List<Order>> GetOrdersByCustomerAsync(Guid customerId)
        {
            return await _orderRepo.GetOrderByCustomerIdAsync(customerId);
        }

        public async Task<bool> UpdateOrderStatusAsync(Guid orderId, string status)
        {
            var order = await _orderRepo.GetOrderByIdAsync(orderId);
            if (order == null) return false;

            order.UpdateStatus(status);
            await _orderRepo.UpdateOrderAsync(order);
            return true;
        }

    }
}
