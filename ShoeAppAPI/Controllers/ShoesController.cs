using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoeShopAPI.DTOs;                 // DTOs for creating/updating shoes
using ShoeShopAPI.Services.Interfaces;  // Service interface for shoe operations

namespace ShoeShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Base route: api/shoes
    public class ShoesController : ControllerBase
    {
        private readonly IShoeService _service;

        // Constructor injects the shoe service (business logic for shoes)
        public ShoesController(IShoeService service) => _service = service;

        // -------------------- GET ALL SHOES (PUBLIC) --------------------
        [HttpGet]
        [AllowAnonymous] // Anyone (even not logged in) can see the product list
        public async Task<IActionResult> GetShoes() =>
            Ok(await _service.GetAllShoesAsync());

        // -------------------- GET ONE SHOE (PUBLIC) --------------------
        [HttpGet("{id:int}")] // Route param = shoe ID
        [AllowAnonymous] // Public access
        public async Task<IActionResult> GetShoe(int id)
        {
            var shoe = await _service.GetShoeAsync(id);

            // Return 404 if shoe not found
            return shoe == null ? NotFound() : Ok(shoe);
        }

        // -------------------- CREATE SHOE (ADMIN ONLY) --------------------
        [HttpPost]
        [Authorize(Roles = "Admin")] // Restrict to Admin
        public async Task<IActionResult> AddShoe([FromBody] ShoeCreateDto dto)
        {
            // Service creates new shoe and returns it
            var newShoe = await _service.AddShoeAsync(dto);

            // Return 201 Created, pointing to the GetShoe endpoint for the new shoe
            return CreatedAtAction(nameof(GetShoe), new { id = newShoe.Id }, newShoe);
        }

        // -------------------- UPDATE SHOE (ADMIN ONLY) --------------------
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateShoe(int id, [FromBody] ShoeCreateDto dto)
        {
            // Service updates shoe if exists
            var updated = await _service.UpdateShoeAsync(id, dto);

            // If shoe not found, return 404
            return updated == null ? NotFound() : Ok(updated);
        }

        // -------------------- DELETE SHOE (ADMIN ONLY) --------------------
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteShoe(int id)
        {
            // Service tries to delete shoe
            var deleted = await _service.DeleteShoeAsync(id);

            // Return 204 if deleted, else 404 if shoe doesn't exist
            return deleted ? NoContent() : NotFound();
        }
    }
}
