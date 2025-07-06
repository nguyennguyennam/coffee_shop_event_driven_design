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
using Microsoft.AspNetCore.Mvc;

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
            Console.WriteLine(request.VoucherCode);
            if (!string.IsNullOrEmpty(request.VoucherCode))
            {
                voucher = await _voucherCommand.CheckAndUpdateVoucherAsync(request.VoucherCode);
            }
            List<OrderItem> items = await OrderHelper.MapOrderItemList(request.Items);

            //Test//
            Console.WriteLine($"Number of items received from MapOrderItemList: {items.Count}");
            if (items.Count == 0)
            {
                Console.WriteLine("Items list is EMPTY or NULL!");
            }
            else
            {
                Console.WriteLine("Contents of items list:");
                foreach (var item in items)
                {
                    Console.WriteLine($"- DrinkId: {item.DrinkId}, Quantity: {item.Quantity}, DrinkName: {item.DrinkName}");
                }
            }
            //End of test

            var voucherId = voucher?.Id;
            var order = OrderFactory.CreateOrder(request.CustomerId, voucherId, DateTime.UtcNow, "Payment", items, request.TotalPrice, voucher, request.customerType);

            var new_order = await _orderRepo.CreateOrderAsync(order);
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
                await _customerRepo.UpdateCustomerTypeAsync(request.CustomerId);
            }
            return new_order;
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

    }
}
