using Microsoft.EntityFrameworkCore;
using ShoeShopAPI.Data;
using ShoeShopAPI.Models;
using ShoeShopAPI.Repositories.Interfaces;

namespace ShoeShopAPI.Repositories
{
    // Repository class for managing Shoe entities
    // Implements IShoeRepository interface
    public class ShoeRepository : IShoeRepository
    {
        private readonly AppDbContext _context;

        // Constructor: inject the AppDbContext so this repository
        // can interact with the database
        public ShoeRepository(AppDbContext context) => _context = context;

        // Get all shoes from the database
        public async Task<IEnumerable<Shoe>> GetAllAsync()
            => await _context.Shoes.ToListAsync();

        // Get a single shoe by its ID
        public async Task<Shoe?> GetByIdAsync(int id)
            => await _context.Shoes.FindAsync(id);

        // Add a new shoe record into the database
        public async Task<Shoe> AddAsync(Shoe shoe)
        {
            _context.Shoes.Add(shoe); // mark entity as added
            await _context.SaveChangesAsync(); // commit to DB
            return shoe; // return the saved entity
        }

        // Update an existing shoe in the database
        public async Task<Shoe?> UpdateAsync(Shoe shoe)
        {
            // Look for an existing shoe with the same ID
            var existing = await _context.Shoes.FindAsync(shoe.Id);
            if (existing == null) return null; // return null if not found

            // Copy new values into the existing entity
            _context.Entry(existing).CurrentValues.SetValues(shoe);

            // Save changes to DB
            await _context.SaveChangesAsync();
            return existing; // return the updated shoe
        }

        // Delete a shoe by ID
        public async Task<bool> DeleteAsync(int id)
        {
            var shoe = await _context.Shoes.FindAsync(id);
            if (shoe == null) return false; // nothing to delete

            _context.Shoes.Remove(shoe); // mark entity as removed
            await _context.SaveChangesAsync(); // commit changes
            return true; // confirm deletion
        }
    }
}
