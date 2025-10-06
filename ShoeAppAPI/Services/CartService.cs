using ShoeShopAPI.DTOs;
using ShoeShopAPI.Models;
using ShoeShopAPI.Repositories.Interfaces;
using ShoeShopAPI.Services.Interfaces;

namespace ShoeShopAPI.Services
{
    // Service layer that handles cart-related logic for the user
    public class CartService : ICartService
    {
        private readonly ICartRepository _repo;     // Repository for cart operations (DB access)
        private readonly IShoeRepository _shoeRepo; // Repository for shoe data (to check stock, etc.)

        // Constructor: injects both cart and shoe repositories (Dependency Injection)
        public CartService(ICartRepository repo, IShoeRepository shoeRepo)
        {
            _repo = repo;
            _shoeRepo = shoeRepo;
        }

        // 📌 Get the entire cart for a user
        public async Task<IEnumerable<CartItemDto>> GetCartAsync(int userId) =>
            (await _repo.GetCartAsync(userId)).Select(c => new CartItemDto
            {
                Id = c.Id,
                ShoeId = c.ShoeId,
                Quantity = c.Quantity,
                Name = c.Shoe.Name,       // map shoe details from DB
                Price = c.Shoe.Price,
                ImageUrl = c.Shoe.ImageUrl
            });

        // 📌 Add a new item to the user's cart
        public async Task<CartItemDto> AddToCartAsync(int userId, CartItemCreateDto dto)
        {
            // Find the shoe in the database by ID
            var shoe = await _shoeRepo.GetByIdAsync(dto.ShoeId);
            if (shoe == null)
                throw new Exception("Shoe not found."); // error if shoe doesn't exist

            // Ensure shoe has stock available
            if (shoe.Stock <= 0)
                throw new Exception($"{shoe.Name} is out of stock and cannot be added.");

            // Ensure requested quantity does not exceed stock
            if (dto.Quantity > shoe.Stock)
                throw new Exception($"{shoe.Name} only has {shoe.Stock} left in stock.");

            // Create a new CartItem for the user
            var cartItem = new CartItem { UserId = userId, ShoeId = dto.ShoeId, Quantity = dto.Quantity };

            // Save it to the database through repository
            var added = await _repo.AddToCartAsync(cartItem);

            // Return a DTO (Data Transfer Object) for API response
            return new CartItemDto
            {
                Id = added.Id,
                ShoeId = added.ShoeId,
                Quantity = added.Quantity,
                Name = added.Shoe.Name,
                Price = added.Shoe.Price,
                ImageUrl = added.Shoe.ImageUrl
            };
        }

        // 📌 Remove a specific cart item by ID
        public async Task<bool> RemoveFromCartAsync(int userId, int id) => await _repo.RemoveFromCartAsync(userId, id);

        // 📌 Clear the entire cart for the user
        public async Task ClearCartAsync(int userId) => await _repo.ClearCartAsync(userId);
    }
}
