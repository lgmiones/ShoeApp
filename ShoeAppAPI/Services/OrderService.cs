using ShoeShopAPI.DTOs;
using ShoeShopAPI.Models;
using ShoeShopAPI.Repositories.Interfaces;
using ShoeShopAPI.Services.Interfaces;

namespace ShoeShopAPI.Services
{
    public class OrderService : IOrderService
    {
        private readonly ICartRepository _cartRepo;
        private readonly IOrderRepository _orderRepo;

        public OrderService(ICartRepository cartRepo, IOrderRepository orderRepo)
        {
            _cartRepo = cartRepo;
            _orderRepo = orderRepo;
        }

        public async Task<OrderDto> PlaceOrderAsync()
        {
            var cartItems = await _cartRepo.GetCartAsync();

            // Calculate total price
            var totalPrice = cartItems.Sum(c => c.Shoe.Price * c.Quantity);

            var order = new Order
            {
                Items = cartItems.Select(c => new OrderItem
                {
                    ShoeId = c.ShoeId,
                    Quantity = c.Quantity,
                    Price = c.Shoe.Price // ✅ store price at order time
                }).ToList(),
                TotalPrice = totalPrice, // ✅ assign total
                CreatedAt = DateTime.UtcNow
            };

            var placed = await _orderRepo.PlaceOrderAsync(order);
            await _cartRepo.ClearCartAsync();

            return new OrderDto
            {
                Id = placed.Id,
                CreatedAt = placed.CreatedAt,
                TotalPrice = placed.TotalPrice, // ✅ return it
                Items = placed.Items.Select(i => new OrderItemDto
                {
                    ShoeId = i.ShoeId,
                    Quantity = i.Quantity,
                    Price = i.Price
                }).ToList()
            };
        }


        public async Task<IEnumerable<OrderDto>> GetOrdersAsync() =>
        (await _orderRepo.GetOrdersAsync()).Select(o => new OrderDto
        {
            Id = o.Id,
            CreatedAt = o.CreatedAt,
            TotalPrice = o.TotalPrice, // ✅ include it
            Items = o.Items.Select(i => new OrderItemDto
            {
                ShoeId = i.ShoeId,
                Quantity = i.Quantity,
                Price = i.Price
            }).ToList()
        });

        public async Task DeleteOrderAsync(int id) // ✅
        {
            await _orderRepo.DeleteOrderAsync(id);
        }
    }
}
