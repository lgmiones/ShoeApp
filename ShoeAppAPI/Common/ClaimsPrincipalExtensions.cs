using System.Security.Claims; // Provides classes for handling user identity claims

namespace ShoeShopAPI.Common
{
    // Static class for extending ClaimsPrincipal with custom helper methods
    public static class ClaimsPrincipalExtensions
    {
        // Extension method for ClaimsPrincipal (the user object in ASP.NET Core)
        // Purpose: Retrieve the current user's ID (stored as NameIdentifier claim) as an int
        public static int GetUserId(this ClaimsPrincipal user) =>
            int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
        // FindFirstValue looks up the claim by type (NameIdentifier holds the UserId).
        // The '!' ensures it's not null, then parse it to an integer.
    }
}
