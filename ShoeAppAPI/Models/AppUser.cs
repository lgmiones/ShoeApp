using Microsoft.AspNetCore.Identity; // Identity base classes

namespace ShoeShopAPI.Models
{
    // Custom application user model
    // Inherits from IdentityUser<int>, meaning the primary key (Id) is an int
    // This matches other entities in your app (like Order.UserId which is int)
    public class AppUser : IdentityUser<int>
    {
        // IdentityUser<int> already includes:
        // Id, UserName, NormalizedUserName, Email, PasswordHash,
        // PhoneNumber, Lockout info, SecurityStamp, etc.

        // You can add extra profile fields here in the future,
        // e.g., FirstName, LastName, Address, ProfilePicture, etc.
    }
}
