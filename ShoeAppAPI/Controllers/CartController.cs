using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoeShopAPI.Common;
using ShoeShopAPI.Services.Interfaces;

namespace ShoeShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // any logged-in user
    public class CartController : ControllerBase
    {
        private readonly ICartService _service;
        public CartController(ICartService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = User.GetUserId();
            return Ok(await _service.GetCartAsync(userId));
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] CartItemCreateDto dto)
        {
            var userId = User.GetUserId();
            return Ok(await _service.AddToCartAsync(userId, dto));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var userId = User.GetUserId();
            var removed = await _service.RemoveFromCartAsync(userId, id);
            return removed ? NoContent() : NotFound();
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = User.GetUserId();
            await _service.ClearCartAsync(userId);
            return NoContent();
        }
    }
}
