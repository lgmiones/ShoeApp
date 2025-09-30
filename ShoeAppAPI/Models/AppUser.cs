using Microsoft.AspNetCore.Identity;

namespace ShoeShopAPI.Models
{
    // Using int keys keeps parity with your Order.UserId (int).
    public class AppUser : IdentityUser<int>
    {
        // Add profile fields later if needed
    }
}
