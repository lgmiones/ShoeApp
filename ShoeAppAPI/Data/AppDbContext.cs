using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ShoeShopAPI.Models;

namespace ShoeShopAPI.Data
{
    // Inherit from IdentityDbContext to include Identity tables (Users, Roles, Claims, etc.)
    public class AppDbContext : IdentityDbContext<AppUser, IdentityRole<int>, int>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Define DbSets (tables) for your custom entities
        public DbSet<Shoe> Shoes => Set<Shoe>();
        public DbSet<CartItem> CartItems => Set<CartItem>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            base.OnModelCreating(b);

            // -------------------- CART ITEM RELATIONS --------------------
            b.Entity<CartItem>()
                .HasOne(ci => ci.User)
                .WithMany()
                .HasForeignKey(ci => ci.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            b.Entity<CartItem>()
                .HasOne(ci => ci.Shoe)
                .WithMany()
                .HasForeignKey(ci => ci.ShoeId)
                .OnDelete(DeleteBehavior.Cascade);

            // -------------------- ORDER RELATIONS --------------------
            b.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            b.Entity<OrderItem>()
                .HasOne(oi => oi.Shoe)
                .WithMany()
                .HasForeignKey(oi => oi.ShoeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
