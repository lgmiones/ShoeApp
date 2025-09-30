using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ShoeShopAPI.Data;
using ShoeShopAPI.Models;
using ShoeShopAPI.Repositories.Interfaces;

namespace ShoeShopAPI.Repositories
{
    // Implements IOrderRepository with explicit interface method implementations
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _context;
        public OrderRepository(AppDbContext context) => _context = context;

        // Create & return the saved order (reloaded with navigations)
        async Task<Order> IOrderRepository.PlaceOrderAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Reload with navigations so services can map Shoe + User data
            var reloaded = await _context.Orders
                .AsNoTracking()
                .Include(o => o.Items).ThenInclude(i => i.Shoe)
                .Include(o => o.User)
                .FirstAsync(o => o.Id == order.Id);

            return reloaded;
        }

        // Current user's orders
        async Task<IEnumerable<Order>> IOrderRepository.GetOrdersAsync(int userId)
        {
            return await _context.Orders
                .AsNoTracking()
                .Where(o => o.UserId == userId)
                .Include(o => o.Items).ThenInclude(i => i.Shoe)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        // ADMIN: all customers' orders
        async Task<IEnumerable<Order>> IOrderRepository.GetAllOrdersAsync()
        {
            return await _context.Orders
                .AsNoTracking()
                .Include(o => o.Items).ThenInclude(i => i.Shoe)
                .Include(o => o.User) // so OrderDto.UserEmail can be filled
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        // Delete only if the order belongs to the given user
        async Task IOrderRepository.DeleteOrderAsync(int userId, int id)
        {
            var order = await _context.Orders
                .Where(o => o.Id == id && o.UserId == userId)
                .Include(o => o.Items)
                .FirstOrDefaultAsync();

            if (order == null) return;

            // If cascade delete isn’t configured, remove items explicitly
            _context.OrderItems.RemoveRange(order.Items);
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
        }

        // ADMIN: delete any order
        async Task IOrderRepository.DeleteOrderAsAdminAsync(int id)
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
