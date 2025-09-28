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

        public OrderService(ICartRepository cartRepo, IOrderRepository orderRepo, IShoeRepository shoeRepo)
        {
            _cartRepo = cartRepo;
            _orderRepo = orderRepo;
            _shoeRepo = shoeRepo;
        }

        public async Task<OrderDto> PlaceOrderAsync()
        {
            var cartItems = await _cartRepo.GetCartAsync();
            
            if (!cartItems.Any())
                throw new Exception("Cart is empty.");

            // Step 1: Group by ShoeId and sum quantities
            var groupedCart = cartItems
                .GroupBy(c => c.ShoeId)
                .Select(g => new 
                {
                    ShoeId = g.Key,
                    Quantity = g.Sum(x => x.Quantity)
                })
                .ToList();

            // Step 2: Validate stock for each grouped item
            foreach (var item in groupedCart)
            {
                var shoe = await _shoeRepo.GetByIdAsync(item.ShoeId);
                if (shoe == null)
                    throw new Exception($"Shoe with ID {item.ShoeId} not found.");

                if (shoe.Stock < item.Quantity)
                    throw new Exception($"{shoe.Name} does not have enough stock.");
            }

            // Step 3: Decrement stock safely
            foreach (var item in groupedCart)
            {
                var shoe = await _shoeRepo.GetByIdAsync(item.ShoeId);
                shoe!.Stock -= item.Quantity;
                await _shoeRepo.UpdateAsync(shoe);
            }

            // Step 4: Place order using original cart items (so duplicates remain for order items)
            var totalPrice = cartItems.Sum(c => c.Shoe.Price * c.Quantity);
            var order = new Order
            {
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
            await _cartRepo.ClearCartAsync();

            return new OrderDto
            {
                Id = placed.Id,
                CreatedAt = placed.CreatedAt,
                TotalPrice = placed.TotalPrice,
                Items = placed.Items.Select(i => new OrderItemDto
                {
                    ShoeId = i.ShoeId,
                    Name = i.Shoe.Name,
                    Brand = i.Shoe.Brand,
                    ImageUrl = i.Shoe.ImageUrl,
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
                Name = i.Shoe.Name,
                Brand = i.Shoe.Brand,
                ImageUrl = i.Shoe.ImageUrl,
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
