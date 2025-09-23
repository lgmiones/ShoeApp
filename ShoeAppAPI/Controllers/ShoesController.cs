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

        [HttpGet]
        public async Task<IActionResult> GetShoes() => Ok(await _service.GetAllShoesAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetShoe(int id)
        {
            var shoe = await _service.GetShoeAsync(id);
            return shoe == null ? NotFound() : Ok(shoe);
        }

        [HttpPost]
        public async Task<IActionResult> AddShoe(ShoeCreateDto dto)
        {
            var newShoe = await _service.AddShoeAsync(dto);
            return CreatedAtAction(nameof(GetShoe), new { id = newShoe.Id }, newShoe);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateShoe(int id, ShoeCreateDto dto)
        {
            var updated = await _service.UpdateShoeAsync(id, dto);
            return updated == null ? NotFound() : Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShoe(int id)
        {
            var deleted = await _service.DeleteShoeAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}
