using ShoeShopAPI.DTOs;

namespace ShoeShopAPI.Services.Interfaces
{
    public interface ICartService
    {
        Task<IEnumerable<CartItemDto>> GetCartAsync();
        Task<CartItemDto> AddToCartAsync(CartItemCreateDto dto);
        Task<bool> RemoveFromCartAsync(int id);
        Task ClearCartAsync();
    }
}
