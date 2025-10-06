using Microsoft.EntityFrameworkCore;
using ShoeShopAPI.Data;
using ShoeShopAPI.Models;
using ShoeShopAPI.Repositories.Interfaces;

namespace ShoeShopAPI.Repositories
{
    // Repository class responsible for handling database operations for Orders
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _context;

        public OrderRepository(AppDbContext context) => _context = context;

        public async Task<Order> PlaceOrderAsync(Order order)
        {
            _context.Orders.Add(order);

            await _context.SaveChangesAsync();

            var reloaded = await _context.Orders
                .AsNoTracking()
                .Include(o => o.Items).ThenInclude(i => i.Shoe)
                .Include(o => o.User)
                .FirstAsync(o => o.Id == order.Id);

            return reloaded;
        }


        public async Task<IEnumerable<Order>> GetOrdersAsync(int userId)
        {
            return await _context.Orders
                .AsNoTracking()
                .Where(o => o.UserId == userId)
                .Include(o => o.Items).ThenInclude(i => i.Shoe)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        // Get ALL orders (for admin dashboard view, no filtering by user)
        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            return await _context.Orders
                .AsNoTracking()
                .Include(o => o.Items).ThenInclude(i => i.Shoe)
                .Include(o => o.User)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task DeleteOrderAsync(int userId, int id)
        {
            var order = await _context.Orders
                .Where(o => o.Id == id && o.UserId == userId)
                .Include(o => o.Items)
                .FirstOrDefaultAsync();

            if (order == null) return;

            _context.OrderItems.RemoveRange(order.Items);

            _context.Orders.Remove(order);

            await _context.SaveChangesAsync();
        }

        // Delete ANY order (admin privilege, no user check required)
        public async Task DeleteOrderAsAdminAsync(int id)
        {
            var order = await _context.Orders
                .Where(o => o.Id == id)
                .Include(o => o.Items)
                .FirstOrDefaultAsync();

            if (order == null) return;

            _context.OrderItems.RemoveRange(order.Items);

            _context.Orders.Remove(order);

            await _context.SaveChangesAsync();
        }
    }
}
