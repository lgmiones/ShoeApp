using ShoeShopAPI.Models;

namespace ShoeShopAPI.Repositories.Interfaces
{
    public interface IShoeRepository
    {
        Task<IEnumerable<Shoe>> GetAllAsync();
        Task<Shoe?> GetByIdAsync(int id);
        Task<Shoe> AddAsync(Shoe shoe);
        Task<Shoe?> UpdateAsync(Shoe shoe);
        Task<bool> DeleteAsync(int id);
    }
}
