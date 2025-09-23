using Microsoft.EntityFrameworkCore;
using ShoeShopAPI.Data;
using ShoeShopAPI.Models;
using ShoeShopAPI.Repositories.Interfaces;

namespace ShoeShopAPI.Repositories
{
    public class CartRepository : ICartRepository
    {
        private readonly AppDbContext _context;
        public CartRepository(AppDbContext context) => _context = context;

        public async Task<IEnumerable<CartItem>> GetCartAsync() =>
            await _context.CartItems.Include(c => c.Shoe).ToListAsync();

        public async Task<CartItem> AddToCartAsync(CartItem item)
        {
            _context.CartItems.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<bool> RemoveFromCartAsync(int id)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null) return false;
            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task ClearCartAsync()
        {
            _context.CartItems.RemoveRange(_context.CartItems);
            await _context.SaveChangesAsync();
        }
    }
}
