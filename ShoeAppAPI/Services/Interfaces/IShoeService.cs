using ShoeShopAPI.DTOs;

namespace ShoeShopAPI.Services.Interfaces
{
    public interface IShoeService
    {
        Task<IEnumerable<ShoeDto>> GetAllShoesAsync();
        Task<ShoeDto?> GetShoeAsync(int id);
        Task<ShoeDto> AddShoeAsync(ShoeCreateDto dto);
        Task<ShoeDto?> UpdateShoeAsync(int id, ShoeCreateDto dto);
        Task<bool> DeleteShoeAsync(int id);
    }
}
