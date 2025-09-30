using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoeShopAPI.DTOs;
using ShoeShopAPI.Services.Interfaces;

namespace ShoeShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShoesController : ControllerBase
    {
        private readonly IShoeService _service;
        public ShoesController(IShoeService service) => _service = service;

        // Public: list shoes
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetShoes() =>
            Ok(await _service.GetAllShoesAsync());

        // Public: get one shoe
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetShoe(int id)
        {
            var shoe = await _service.GetShoeAsync(id);
            return shoe == null ? NotFound() : Ok(shoe);
        }

        // Admin: create shoe
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddShoe([FromBody] ShoeCreateDto dto)
        {
            var newShoe = await _service.AddShoeAsync(dto);
            return CreatedAtAction(nameof(GetShoe), new { id = newShoe.Id }, newShoe);
        }

        // Admin: update shoe
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateShoe(int id, [FromBody] ShoeCreateDto dto)
        {
            var updated = await _service.UpdateShoeAsync(id, dto);
            return updated == null ? NotFound() : Ok(updated);
        }

        // Admin: delete shoe
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteShoe(int id)
        {
            var deleted = await _service.DeleteShoeAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}
