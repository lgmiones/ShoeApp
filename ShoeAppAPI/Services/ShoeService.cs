using ShoeShopAPI.DTOs;
using ShoeShopAPI.Models;
using ShoeShopAPI.Repositories.Interfaces;
using ShoeShopAPI.Services.Interfaces;

namespace ShoeShopAPI.Services
{
    public class ShoeService : IShoeService
    {
        private readonly IShoeRepository _repo;
        public ShoeService(IShoeRepository repo) => _repo = repo;

        public async Task<IEnumerable<ShoeDto>> GetAllShoesAsync() =>
    (await _repo.GetAllAsync()).Select(s => new ShoeDto
    {
        Id = s.Id,
        Name = s.Name,
        Brand = s.Brand,
        Price = s.Price,
        ImageUrl = s.ImageUrl  // ✅
    });

        public async Task<ShoeDto?> GetShoeAsync(int id)
        {
            var s = await _repo.GetByIdAsync(id);
            return s == null ? null : new ShoeDto { Id = s.Id, Name = s.Name, Brand = s.Brand, Price = s.Price, ImageUrl = s.ImageUrl }; // ✅
        }

        public async Task<ShoeDto> AddShoeAsync(ShoeCreateDto dto)
        {
            var shoe = new Shoe { Name = dto.Name, Brand = dto.Brand, Price = dto.Price, Stock = dto.Stock, ImageUrl = dto.ImageUrl }; // ✅
            var added = await _repo.AddAsync(shoe);
            return new ShoeDto { Id = added.Id, Name = added.Name, Brand = added.Brand, Price = added.Price, ImageUrl = added.ImageUrl }; // ✅
        }

        public async Task<ShoeDto?> UpdateShoeAsync(int id, ShoeCreateDto dto)
        {
            var shoe = new Shoe { Id = id, Name = dto.Name, Brand = dto.Brand, Price = dto.Price, Stock = dto.Stock, ImageUrl = dto.ImageUrl }; // ✅
            var updated = await _repo.UpdateAsync(shoe);
            return updated == null ? null : new ShoeDto { Id = updated.Id, Name = updated.Name, Brand = updated.Brand, Price = updated.Price, ImageUrl = updated.ImageUrl }; // ✅
        }

        public async Task<bool> DeleteShoeAsync(int id) => await _repo.DeleteAsync(id);
    }
}
