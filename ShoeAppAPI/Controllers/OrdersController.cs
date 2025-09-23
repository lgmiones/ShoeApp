using Microsoft.AspNetCore.Mvc;
using ShoeShopAPI.Services.Interfaces;

namespace ShoeShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _service;
        public OrdersController(IOrderService service) => _service = service;

        [HttpPost]
        public async Task<IActionResult> PlaceOrder() => Ok(await _service.PlaceOrderAsync());

        [HttpGet]
        public async Task<IActionResult> GetOrders() => Ok(await _service.GetOrdersAsync());

        [HttpDelete("{id}")] // ✅ new delete endpoint
        public async Task<IActionResult> DeleteOrder(int id)
        {
            await _service.DeleteOrderAsync(id);
            return NoContent(); // 204 No Content
        }
    }
}
