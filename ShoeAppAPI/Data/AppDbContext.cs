using Microsoft.AspNetCore.Identity;                  // For Identity roles
using Microsoft.AspNetCore.Identity.EntityFrameworkCore; // IdentityDbContext base class
using Microsoft.EntityFrameworkCore;                 // EF Core ORM
using ShoeShopAPI.Models;                            // Your domain models

namespace ShoeShopAPI.Data
{
    // Inherit from IdentityDbContext to include Identity tables (Users, Roles, Claims, etc.)
    // AppUser = custom user model
    // IdentityRole<int> = role with int as primary key
    // int = primary key type for both users and roles
    public class AppDbContext : IdentityDbContext<AppUser, IdentityRole<int>, int>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Define DbSets (tables) for your custom entities
        public DbSet<Shoe> Shoes => Set<Shoe>();
        public DbSet<CartItem> CartItems => Set<CartItem>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();

        // Configure entity relationships and behaviors
        protected override void OnModelCreating(ModelBuilder b)
        {
            base.OnModelCreating(b); // Keep Identity’s configurations

            // -------------------- CART ITEM RELATIONS --------------------
            b.Entity<CartItem>()
                .HasOne(ci => ci.User)               // Each cart item belongs to one user
                .WithMany()                          // User can have many cart items
                .HasForeignKey(ci => ci.UserId)      // Foreign key: UserId
                .OnDelete(DeleteBehavior.Cascade);   // If user is deleted → cart items deleted too

            b.Entity<CartItem>()
                .HasOne(ci => ci.Shoe)               // Each cart item refers to one shoe
                .WithMany()                          // A shoe can exist in many carts
                .HasForeignKey(ci => ci.ShoeId)      // Foreign key: ShoeId
                .OnDelete(DeleteBehavior.Cascade);   // If shoe deleted → related cart items deleted

            // -------------------- ORDER RELATIONS --------------------
            b.Entity<Order>()
                .HasOne(o => o.User)                 // Each order belongs to one user
                .WithMany()                          // User can place many orders
                .HasForeignKey(o => o.UserId)        // Foreign key: UserId
                .OnDelete(DeleteBehavior.Restrict);  // Prevent deleting user if they have orders

            b.Entity<OrderItem>()
                .HasOne(oi => oi.Shoe)               // Each order item refers to one shoe
                .WithMany()                          // A shoe can be part of many order items
                .HasForeignKey(oi => oi.ShoeId)      // Foreign key: ShoeId
                .OnDelete(DeleteBehavior.Restrict);  // Prevent deleting shoe if tied to past orders
        }
    }
}
