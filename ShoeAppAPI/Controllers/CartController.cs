using Microsoft.AspNetCore.Mvc;
using ShoeShopAPI.DTOs;
using ShoeShopAPI.Services.Interfaces;

namespace ShoeShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _service;
        public CartController(ICartService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetCart() => Ok(await _service.GetCartAsync());

        [HttpPost]
        public async Task<IActionResult> AddToCart(CartItemCreateDto dto) => Ok(await _service.AddToCartAsync(dto));

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var removed = await _service.RemoveFromCartAsync(id);
            return removed ? NoContent() : NotFound();
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            await _service.ClearCartAsync();
            return NoContent();
        }
    }
}
