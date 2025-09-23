using ShoeShopAPI.DTOs;

namespace ShoeShopAPI.Services.Interfaces
{
    public interface ICartService
    {
        Task<IEnumerable<CartItemDto>> GetCartAsync();
        Task<CartItemDto> AddToCartAsync(CartItemDto dto);
        Task<bool> RemoveFromCartAsync(int id);
        Task ClearCartAsync();
    }
}
