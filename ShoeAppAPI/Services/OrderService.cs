using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
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
        private readonly IShoeRepository _shoeRepo;

        public OrderService(
            ICartRepository cartRepo,
            IOrderRepository orderRepo,
            IShoeRepository shoeRepo)
        {
            _cartRepo = cartRepo;
            _orderRepo = orderRepo;
            _shoeRepo = shoeRepo;
        }

        // ---------------------------
        // Helpers
        // ---------------------------
        private static OrderDto MapOrder(Order o)
        {
            return new OrderDto
            {
                Id = o.Id,
                CreatedAt = o.CreatedAt,
                TotalPrice = o.TotalPrice,
                // You said you added this to OrderDto
                UserEmail = o.User?.Email,
                Items = (o.Items ?? new List<OrderItem>()).Select(i => new OrderItemDto
                {
                    ShoeId = i.ShoeId,
                    Name = i.Shoe?.Name,
                    Brand = i.Shoe?.Brand,
                    ImageUrl = i.Shoe?.ImageUrl,
                    Quantity = i.Quantity,
                    Price = i.Price
                }).ToList()
            };
        }

        // ---------------------------
        // Customer / current user
        // ---------------------------
        public async Task<OrderDto> PlaceOrderAsync(int userId)
        {
            var cartItems = await _cartRepo.GetCartAsync(userId);
            if (cartItems == null || !cartItems.Any())
                throw new Exception("Cart is empty.");

            // Group quantities per shoe to check stock
            var grouped = cartItems
                .GroupBy(c => c.ShoeId)
                .Select(g => new { ShoeId = g.Key, Quantity = g.Sum(x => x.Quantity) })
                .ToList();

            // Stock checks
            foreach (var item in grouped)
            {
                var shoe = await _shoeRepo.GetByIdAsync(item.ShoeId)
                           ?? throw new Exception($"Shoe {item.ShoeId} not found.");
                if (shoe.Stock < item.Quantity)
                    throw new Exception($"{shoe.Name} does not have enough stock.");
            }

            // Deduct stock
            foreach (var item in grouped)
            {
                var shoe = await _shoeRepo.GetByIdAsync(item.ShoeId)
                           ?? throw new Exception($"Shoe {item.ShoeId} not found."); // safety
                shoe.Stock -= item.Quantity;
                await _shoeRepo.UpdateAsync(shoe);
            }

            // Build order from cart snapshot
            var totalPrice = cartItems.Sum(c => c.Shoe.Price * c.Quantity);
            var order = new Order
            {
                UserId = userId,
                Items = cartItems.Select(c => new OrderItem
                {
                    ShoeId = c.ShoeId,
                    Quantity = c.Quantity,
                    Price = c.Shoe.Price
                }).ToList(),
                TotalPrice = totalPrice,
                CreatedAt = DateTime.UtcNow
            };

            var placed = await _orderRepo.PlaceOrderAsync(order);

            // Clear cart after successful placement
            await _cartRepo.ClearCartAsync(userId);

            // We can safely map from the known cart snapshot (has Shoe info) even if repo didn't load navigations on 'placed'
            var dto = new OrderDto
            {
                Id = placed.Id,
                CreatedAt = placed.CreatedAt,
                TotalPrice = placed.TotalPrice,
                UserEmail = null, // current user’s email isn’t critical here; controller's /me can provide it if ever needed
                Items = cartItems.Select(i => new OrderItemDto
                {
                    ShoeId = i.ShoeId,
                    Name = i.Shoe.Name,
                    Brand = i.Shoe.Brand,
                    ImageUrl = i.Shoe.ImageUrl,
                    Quantity = i.Quantity,
                    Price = i.Shoe.Price
                }).ToList()
            };

            return dto;
        }

        public async Task<IEnumerable<OrderDto>> GetOrdersAsync(int userId)
        {
            // Repository should Include(o => o.Items).ThenInclude(i => i.Shoe)
            // so MapOrder can access Shoe data. UserEmail will be null here (not needed for self-view).
            var orders = await _orderRepo.GetOrdersAsync(userId);
            return orders.Select(MapOrder);
        }

        public async Task DeleteOrderAsync(int userId, int id)
        {
            await _orderRepo.DeleteOrderAsync(userId, id);
        }

        // ---------------------------
        // Admin
        // ---------------------------
        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            // Repository must Include(o => o.Items).ThenInclude(i => i.Shoe)
            // and Include(o => o.User) so UserEmail maps correctly.
            var orders = await _orderRepo.GetAllOrdersAsync();
            return orders.Select(MapOrder);
        }

        public async Task DeleteOrderAsAdminAsync(int id)
        {
            await _orderRepo.DeleteOrderAsAdminAsync(id);
        }
    }
}
