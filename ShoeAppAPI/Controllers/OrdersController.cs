using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoeShopAPI.Common;               // For ClaimsPrincipalExtensions (User.GetUserId)
using ShoeShopAPI.Services.Interfaces;  // Service interface for handling order logic

namespace ShoeShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Base route: api/orders
    [Authorize] // Ensures only authenticated users can access by default
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _service;

        // Injects the order service (handles business logic for orders)
        public OrdersController(IOrderService service) => _service = service;

        // -------------------- PLACE ORDER --------------------
        [HttpPost]
        public async Task<IActionResult> PlaceOrder()
        {
            // Get the logged-in user's ID from JWT claims
            var userId = User.GetUserId();

            // Service handles converting cart → order for this user
            return Ok(await _service.PlaceOrderAsync(userId));
        }

        // -------------------- GET USER'S ORDERS --------------------
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var userId = User.GetUserId();

            // Return all orders belonging to the logged-in user
            return Ok(await _service.GetOrdersAsync(userId));
        }

        // -------------------- DELETE USER'S ORDER --------------------
        [HttpDelete("{id:int}")] // Route param = order ID
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var userId = User.GetUserId();

            // Only deletes if the order belongs to the logged-in user
            await _service.DeleteOrderAsync(userId, id);
            return NoContent(); // Standard 204 response (success but no body)
        }

        // -------------------- GET ALL ORDERS (ADMIN ONLY) --------------------
        [HttpGet("all")]
        [Authorize(Roles = "Admin")] // Restrict to Admin role
        public async Task<IActionResult> GetAllOrders()
        {
            // Admin can fetch the entire order list
            var list = await _service.GetAllOrdersAsync(); // Service implementation required
            return Ok(list);
        }

        // -------------------- ADMIN DELETE ANY ORDER --------------------
        // Example: DELETE /api/orders/5/admin
        [HttpDelete("{id:int}/admin")]
        [Authorize(Roles = "Admin")] // Restrict to Admin role
        public async Task<IActionResult> AdminDeleteOrder(int id)
        {
            // Admin can delete ANY user's order by ID
            await _service.DeleteOrderAsAdminAsync(id); // Service implementation required
            return NoContent();
        }
    }
}
