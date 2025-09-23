using ShoeShopAPI.Models;

namespace ShoeShopAPI.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> PlaceOrderAsync(Order order);
        Task<IEnumerable<Order>> GetOrdersAsync();
        Task DeleteOrderAsync(int id);
    }
}
