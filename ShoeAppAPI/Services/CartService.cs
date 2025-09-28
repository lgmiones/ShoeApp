using ShoeShopAPI.DTOs;
using ShoeShopAPI.Models;
using ShoeShopAPI.Repositories.Interfaces;
using ShoeShopAPI.Services.Interfaces;

namespace ShoeShopAPI.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _repo;
        private readonly IShoeRepository _shoeRepo;
        public CartService(ICartRepository repo, IShoeRepository shoeRepo)
        {
            _repo = repo;
            _shoeRepo = shoeRepo;
        }

        public async Task<IEnumerable<CartItemDto>> GetCartAsync() =>
            (await _repo.GetCartAsync()).Select(c => new CartItemDto
            {
                Id = c.Id,
                ShoeId = c.ShoeId,
                Quantity = c.Quantity,
                Name = c.Shoe.Name,   // ✅ from navigation
                Price = c.Shoe.Price,  // ✅ from navigation
                ImageUrl = c.Shoe.ImageUrl
            });

        public async Task<CartItemDto> AddToCartAsync(CartItemCreateDto dto)
        {
            var shoe = await _shoeRepo.GetByIdAsync(dto.ShoeId);

            if (shoe == null)
                throw new Exception("Shoe not found.");

            if (shoe.Stock <= 0)
                throw new Exception($"{shoe.Name} is out of stock and cannot be added.");

            if (dto.Quantity > shoe.Stock)
                throw new Exception($"{shoe.Name} only has {shoe.Stock} left in stock.");
            
            var cartItem = new CartItem { ShoeId = dto.ShoeId, Quantity = dto.Quantity };
            var added = await _repo.AddToCartAsync(cartItem);
            
            return new CartItemDto
            {
                ShoeId = added.ShoeId,
                Quantity = added.Quantity,
                Name = added.Shoe.Name,
                Price = added.Shoe.Price,
                ImageUrl = added.Shoe.ImageUrl
            };
        }
        public async Task<bool> RemoveFromCartAsync(int id) => await _repo.RemoveFromCartAsync(id);
        public async Task ClearCartAsync() => await _repo.ClearCartAsync();
    }
}
