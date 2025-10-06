using ShoeShopAPI.DTOs;
using ShoeShopAPI.Models;
using ShoeShopAPI.Repositories.Interfaces;
using ShoeShopAPI.Services.Interfaces;

namespace ShoeShopAPI.Services
{
    // Service layer responsible for handling all order-related business logic
    public class OrderService : IOrderService
    {
        private readonly ICartRepository _cartRepo;     // to access cart data (user’s current cart items)
        private readonly IOrderRepository _orderRepo;   // to access orders in the database
        private readonly IShoeRepository _shoeRepo;     // to check/update stock of shoes

        // Constructor: repositories are injected using Dependency Injection
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
        // Helper method
        // ---------------------------
        // Converts an Order entity from DB into an OrderDto for API responses
        private static OrderDto MapOrder(Order o)
        {
            return new OrderDto
            {
                Id = o.Id,
                CreatedAt = o.CreatedAt,
                TotalPrice = o.TotalPrice,
                UserEmail = o.User?.Email, // only populated when admin fetches all orders
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
        // Customer / current user methods
        // ---------------------------

        // 📌 Place an order for the current user
        public async Task<OrderDto> PlaceOrderAsync(int userId)
        {
            // 1. Get all items from the user’s cart
            var cartItems = await _cartRepo.GetCartAsync(userId);
            if (cartItems == null || !cartItems.Any())
                throw new Exception("Cart is empty.");

            // 2. Group items by ShoeId to sum quantities
            var grouped = cartItems
                .GroupBy(c => c.ShoeId)
                .Select(g => new { ShoeId = g.Key, Quantity = g.Sum(x => x.Quantity) })
                .ToList();

            // 3. Check stock availability for each shoe
            foreach (var item in grouped)
            {
                var shoe = await _shoeRepo.GetByIdAsync(item.ShoeId)
                           ?? throw new Exception($"Shoe {item.ShoeId} not found.");
                if (shoe.Stock < item.Quantity)
                    throw new Exception($"{shoe.Name} does not have enough stock.");
            }

            // 4. Deduct stock from each shoe
            foreach (var item in grouped)
            {
                var shoe = await _shoeRepo.GetByIdAsync(item.ShoeId)
                           ?? throw new Exception($"Shoe {item.ShoeId} not found."); // safety check
                shoe.Stock -= item.Quantity;
                await _shoeRepo.UpdateAsync(shoe); // update stock in DB
            }

            // 5. Build an Order entity from the cart snapshot
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

            // 6. Save the new order in the database
            var placed = await _orderRepo.PlaceOrderAsync(order);

            // 7. Clear the user’s cart after successful order
            await _cartRepo.ClearCartAsync(userId);

            // 8. Build an OrderDto from the cart snapshot (ensures Shoe info is available)
            var dto = new OrderDto
            {
                Id = placed.Id,
                CreatedAt = placed.CreatedAt,
                TotalPrice = placed.TotalPrice,
                UserEmail = null, // current user’s email not critical here
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

        // 📌 Get all orders for the current user
        public async Task<IEnumerable<OrderDto>> GetOrdersAsync(int userId)
        {
            // Repository should eager load Items and Shoes
            var orders = await _orderRepo.GetOrdersAsync(userId);
            return orders.Select(MapOrder); // map to DTOs
        }

        // 📌 Delete an order (only the current user’s own order)
        public async Task DeleteOrderAsync(int userId, int id)
        {
            await _orderRepo.DeleteOrderAsync(userId, id);
        }

        // ---------------------------
        // Admin-only methods
        // ---------------------------

        // 📌 Get all orders (for admin management)
        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            var orders = await _orderRepo.GetAllOrdersAsync();
            return orders.Select(MapOrder); // includes UserEmail for admin view
        }

        // 📌 Delete any order (admin privilege)
        public async Task DeleteOrderAsAdminAsync(int id)
        {
            await _orderRepo.DeleteOrderAsAdminAsync(id);
        }
    }
}
