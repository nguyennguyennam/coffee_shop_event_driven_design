using DTO.OrderDTO;
using Repositories.CustomerRepository;
using interfaces.command;
using service.usecase.IOrderUseCase;
using backend.domain.Aggregates.Voucher;
using backend.domain.Aggregates.Order;
using service.helper;
using Repositories.DrinkRepository;
using Application.Orders.Handlers;
using backend.application.Models;
using backend.application.Orders.Command;
using backend.application.interfaces.command;
using backend.application.interfaces.queries;
using Application.Orders.Commands;
using backend.application.Orders.Handlers;
namespace service.implement
{
    public class OrderUseCase : IOrderUseCase
    {
        private readonly IOrderCommand _orderCommand;
        private readonly IOrderQuery _orderQuery;

        private readonly ICustomerRepository _customerRepo;
        private readonly IVoucherCommand _voucherCommand;
        private readonly IIngredientCommand _iingredientCommand;
        private readonly IDrinkRepository _idrinkrepository;

        private readonly UpdateOrderStatusHandler _updateHandler;

        private readonly PlaceOrderHandler _placeOrderHandler;

        public OrderUseCase(
            IOrderCommand orderCommand,
            IOrderQuery orderQuery,
            ICustomerRepository customerRepo,
            IVoucherCommand voucherCommand,
            IIngredientCommand iingredientCommand,
            IDrinkRepository idrinkRepository,
            PlaceOrderHandler placeOrderHandler,
            UpdateOrderStatusHandler updateHandler)
        {
            _orderCommand = orderCommand;
            _orderQuery = orderQuery;
            _customerRepo = customerRepo;
            _voucherCommand = voucherCommand;
            _iingredientCommand = iingredientCommand;
            _idrinkrepository = idrinkRepository;
            _placeOrderHandler = placeOrderHandler;
            _updateHandler = updateHandler;
        }

        public async Task<Order> CreateOrderAsync(CreateOrderDto request)
        {
            // Step 1: Handle Voucher (optional)
            Voucher? voucher = null;
            if (!string.IsNullOrEmpty(request.VoucherCode))
            {
                voucher = await _voucherCommand.CheckAndUpdateVoucherAsync(request.VoucherCode);
            }

            // Step 2: Map Order Items
            List<OrderItem> items = await OrderHelper.MapOrderItemList(request.Items);

            var OrderId = Guid.NewGuid();
            // Step 3: Create PlaceOrderCommand
            var command = new PlaceOrderCommand(
                OrderId,
                request.CustomerId,
                voucher?.Id,
                DateTime.UtcNow,
                "Pending",
                items,
                request.TotalPrice,
                voucher,
                request.customerType
            );

            // Step 4: Save to EventStore
            await _placeOrderHandler.HandleAsync(command);

            // Step 5: Save to database (ReadModel/Entity)
            var orderEntity = new Order(
                command.OrderId,
                command.CustomerId,
                command.VoucherId,
                command.OrderDate,
                command.Status!,
                command.OrderItems,
                command.Price,
                command.Voucher,
                command.CustomerType
            );

            var savedOrder = await _orderCommand.CreateOrderAsync(orderEntity);

            // Step 6: Update ingredient quantity
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

            // Step 7: Update customer type
            var totalOrder = await _orderQuery.CountOrderByCustomerId(request.CustomerId);
            if (totalOrder >= 20)
            {
                await _customerRepo.UpdateCustomerTypeAsync(request.CustomerId);
            }

            return savedOrder;
        }

        public async Task<Order> GetOrderByIdAsync(Guid id)
        {
            var order = await _orderQuery.GetOrderByIdAsync(id);
            if (order == null)
            {
                throw new Exception("Order not found!");
            }
            return order;
        }

        public async Task<List<Order>> GetAllOrderAsync()
        {
            return await _orderQuery.GetAllOrdersAsync();
        }

        public async Task<List<Order>> GetOrdersByCustomerAsync(Guid customerId)
        {
            return await _orderQuery.GetOrderByCustomerIdAsync(customerId);
        }

        public async Task<Order> UpdateOrderAsync(Guid OrderId, string newStatus, Guid userId)
        {

            var updateOrder = new UpdateOrderStatusCommand(OrderId, newStatus, userId);
            var order = await _updateHandler.HandleUpdateAsync(updateOrder);
            
            return order;
        }
    }
}
