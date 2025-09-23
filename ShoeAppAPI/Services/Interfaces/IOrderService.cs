using ShoeShopAPI.DTOs;

namespace ShoeShopAPI.Services.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDto> PlaceOrderAsync();
        Task<IEnumerable<OrderDto>> GetOrdersAsync();
        Task DeleteOrderAsync(int id); // ✅ new
    }
}
