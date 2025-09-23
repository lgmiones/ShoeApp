using ShoeShopAPI.DTOs;
using ShoeShopAPI.Models;
using ShoeShopAPI.Repositories.Interfaces;
using ShoeShopAPI.Services.Interfaces;

namespace ShoeShopAPI.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _repo;
        public CartService(ICartRepository repo) => _repo = repo;

        public async Task<IEnumerable<CartItemDto>> GetCartAsync() =>
            (await _repo.GetCartAsync()).Select(c => new CartItemDto { ShoeId = c.ShoeId, Quantity = c.Quantity });

        public async Task<CartItemDto> AddToCartAsync(CartItemDto dto)
        {
            var cartItem = new CartItem { ShoeId = dto.ShoeId, Quantity = dto.Quantity };
            var added = await _repo.AddToCartAsync(cartItem);
            return new CartItemDto { ShoeId = added.ShoeId, Quantity = added.Quantity };
        }

        public async Task<bool> RemoveFromCartAsync(int id) => await _repo.RemoveFromCartAsync(id);
        public async Task ClearCartAsync() => await _repo.ClearCartAsync();
    }
}
