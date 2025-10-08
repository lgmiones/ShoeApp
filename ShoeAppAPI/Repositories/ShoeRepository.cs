using Microsoft.EntityFrameworkCore;
using ShoeShopAPI.Data;
using ShoeShopAPI.Models;
using ShoeShopAPI.Repositories.Interfaces;

namespace ShoeShopAPI.Repositories
{
    public class ShoeRepository : IShoeRepository
    {
        private readonly AppDbContext _context;

        public ShoeRepository(AppDbContext context) => _context = context;


        public async Task<IEnumerable<Shoe>> GetAllAsync()
            => await _context.Shoes
            .OrderByDescending(s => s.Id)
            .ToListAsync();


        public async Task<Shoe?> GetByIdAsync(int id)
            => await _context.Shoes.FindAsync(id);


        public async Task<Shoe> AddAsync(Shoe shoe)
        {
            _context.Shoes.Add(shoe);
            await _context.SaveChangesAsync();
            return shoe;
        }


        public async Task<Shoe?> UpdateAsync(Shoe shoe)
        {
            var existing = await _context.Shoes.FindAsync(shoe.Id);
            if (existing == null) return null;

            _context.Entry(existing).CurrentValues.SetValues(shoe);

            await _context.SaveChangesAsync();
            return existing;
        }


        public async Task<bool> DeleteAsync(int id)
        {
            var shoe = await _context.Shoes.FindAsync(id);
            if (shoe == null) return false;

            _context.Shoes.Remove(shoe);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
