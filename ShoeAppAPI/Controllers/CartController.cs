using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoeShopAPI.Common;               // Contains the ClaimsPrincipalExtensions (User.GetUserId)
using ShoeShopAPI.Services.Interfaces;  // Cart service interface

namespace ShoeShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Base route: api/cart
    [Authorize] // Ensures only logged-in users can access this controller
    public class CartController : ControllerBase
    {
        private readonly ICartService _service;

        // Constructor injects the cart service (business logic layer)
        public CartController(ICartService service) => _service = service;

        // -------------------- GET CART --------------------
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            // Get logged-in user's ID from JWT claims using the extension method
            var userId = User.GetUserId();

            // Call the service to fetch this user's cart
            return Ok(await _service.GetCartAsync(userId));
        }

        // -------------------- ADD TO CART --------------------
        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] CartItemCreateDto dto)
        {
            // Get current user ID
            var userId = User.GetUserId();

            // Call service to add item to user's cart
            return Ok(await _service.AddToCartAsync(userId, dto));
        }

        // -------------------- REMOVE ITEM FROM CART --------------------
        [HttpDelete("{id:int}")] // Takes cart item ID as route parameter
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var userId = User.GetUserId();

            // Try to remove item, return 204 if removed, 404 if not found
            var removed = await _service.RemoveFromCartAsync(userId, id);
            return removed ? NoContent() : NotFound();
        }

        // -------------------- CLEAR CART --------------------
        [HttpDelete("clear")] // Custom route: api/cart/clear
        public async Task<IActionResult> ClearCart()
        {
            var userId = User.GetUserId();

            // Clear all items in this user's cart
            await _service.ClearCartAsync(userId);
            return NoContent();
        }
    }
}
