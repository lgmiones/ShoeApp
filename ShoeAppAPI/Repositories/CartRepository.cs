using Microsoft.EntityFrameworkCore;
using ShoeShopAPI.Data;
using ShoeShopAPI.Models;
using ShoeShopAPI.Repositories.Interfaces;

namespace ShoeShopAPI.Repositories
{
    // CartRepository is responsible for handling database operations related to the shopping cart
    public class CartRepository : ICartRepository
    {
        private readonly AppDbContext _context;

        public CartRepository(AppDbContext context) => _context = context;

        // ------------------------- GET CART -------------------------
        public async Task<IEnumerable<CartItem>> GetCartAsync(int userId) =>
            await _context.CartItems
                .Include(c => c.Shoe)
                .Where(c => c.UserId == userId)
                .ToListAsync();

        // ------------------------- ADD TO CART -------------------------
        public async Task<CartItem> AddToCartAsync(CartItem item)
        {
            _context.CartItems.Add(item);
            await _context.SaveChangesAsync();


            await _context.Entry(item).Reference(i => i.Shoe).LoadAsync();
            return item;
        }

        // ------------------------- REMOVE FROM CART -------------------------

        public async Task<bool> RemoveFromCartAsync(int userId, int id)
        {
            var cartItem = await _context.CartItems
                .Where(c => c.UserId == userId && c.Id == id)
                .FirstOrDefaultAsync();

            if (cartItem == null) return false;
            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return true;
        }

        // ------------------------- CLEAR CART -------------------------
        public async Task ClearCartAsync(int userId)
        {
            var items = _context.CartItems.Where(c => c.UserId == userId);
            _context.CartItems.RemoveRange(items);
            await _context.SaveChangesAsync();
        }
    }
}
