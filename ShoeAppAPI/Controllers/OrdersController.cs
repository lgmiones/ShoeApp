using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoeShopAPI.Common;
using ShoeShopAPI.Services.Interfaces;

namespace ShoeShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _service;

        public OrdersController(IOrderService service) => _service = service;

        // -------------------- PLACE ORDER --------------------
        [HttpPost]
        public async Task<IActionResult> PlaceOrder()
        {
            var userId = User.GetUserId();
            return Ok(await _service.PlaceOrderAsync(userId));
        }

        // -------------------- GET USER'S ORDERS --------------------
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var userId = User.GetUserId();
            return Ok(await _service.GetOrdersAsync(userId));
        }

        // -------------------- DELETE USER'S ORDER --------------------
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var userId = User.GetUserId();
            await _service.DeleteOrderAsync(userId, id);
            return NoContent();
        }

        // -------------------- GET ALL ORDERS (ADMIN ONLY) --------------------
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var list = await _service.GetAllOrdersAsync();
            return Ok(list);
        }

        // -------------------- ADMIN DELETE ANY ORDER --------------------
        [HttpDelete("{id:int}/admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminDeleteOrder(int id)
        {
            await _service.DeleteOrderAsAdminAsync(id);
            return NoContent();
        }
    }
}
