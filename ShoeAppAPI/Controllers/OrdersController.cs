using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoeShopAPI.Common;
using ShoeShopAPI.Services.Interfaces;

namespace ShoeShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // any logged-in user
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _service;
        public OrdersController(IOrderService service) => _service = service;

        [HttpPost]
        public async Task<IActionResult> PlaceOrder()
        {
            var userId = User.GetUserId();
            return Ok(await _service.PlaceOrderAsync(userId));
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var userId = User.GetUserId();
            return Ok(await _service.GetOrdersAsync(userId));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var userId = User.GetUserId();
            await _service.DeleteOrderAsync(userId, id);
            return NoContent();
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var list = await _service.GetAllOrdersAsync(); // implement in service
            return Ok(list);
        }

        // OPTIONAL: Admin can delete ANY user's order
        // DELETE /api/Orders/{id}/admin
        [HttpDelete("{id:int}/admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminDeleteOrder(int id)
        {
            await _service.DeleteOrderAsAdminAsync(id); // implement in service
            return NoContent();
        }
    }
}
