using ShoeShopAPI.Models;

namespace ShoeShopAPI.Repositories.Interfaces
{
    public interface ICartRepository
    {
        Task<IEnumerable<CartItem>> GetCartAsync();
        Task<CartItem> AddToCartAsync(CartItem item);
        Task<bool> RemoveFromCartAsync(int id);
        Task ClearCartAsync();
    }
}
