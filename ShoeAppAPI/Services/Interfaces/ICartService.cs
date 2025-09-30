using ShoeShopAPI.DTOs;

namespace ShoeShopAPI.Services.Interfaces
{
    public interface ICartService
    {
        Task<IEnumerable<CartItemDto>> GetCartAsync(int userId);
        Task<CartItemDto> AddToCartAsync(int userId, CartItemCreateDto dto);
        Task<bool> RemoveFromCartAsync(int userId, int id);
        Task ClearCartAsync(int userId);
    }
}
