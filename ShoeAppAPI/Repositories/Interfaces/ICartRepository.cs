using ShoeShopAPI.Models;

namespace ShoeShopAPI.Repositories.Interfaces
{
    public interface ICartRepository
    {
        Task<IEnumerable<CartItem>> GetCartAsync(int userId);
        Task<CartItem> AddToCartAsync(CartItem item);
        Task<bool> RemoveFromCartAsync(int userId, int id);
        Task ClearCartAsync(int userId);
    }
}
