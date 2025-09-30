using System.Collections.Generic;
using System.Threading.Tasks;
using ShoeShopAPI.Models;

namespace ShoeShopAPI.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> PlaceOrderAsync(Order order);

        // Current user's orders (scoped)
        Task<IEnumerable<Order>> GetOrdersAsync(int userId);

        // Admin: all orders (no user filter)
        Task<IEnumerable<Order>> GetAllOrdersAsync();

        // Delete only the caller's order
        Task DeleteOrderAsync(int userId, int orderId);

        // Admin: delete any order
        Task DeleteOrderAsAdminAsync(int orderId);
    }
}
