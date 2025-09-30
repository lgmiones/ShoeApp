using ShoeShopAPI.DTOs;

namespace ShoeShopAPI.Services.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDto> PlaceOrderAsync(int userId);
        Task<IEnumerable<OrderDto>> GetOrdersAsync(int userId);
        Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
        Task DeleteOrderAsync(int userId, int id);
        Task DeleteOrderAsAdminAsync(int orderId);
    }
}
