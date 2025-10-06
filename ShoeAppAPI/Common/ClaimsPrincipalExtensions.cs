using System.Security.Claims;

namespace ShoeShopAPI.Common
{
    public static class ClaimsPrincipalExtensions
    {
        public static int GetUserId(this ClaimsPrincipal user) =>
            int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}

//main purpose of ClaimsPrincipalExtensions.cs is to extend the built-in ClaimsPrincipal class 
//(which represents the authenticated user in ASP.NET Core) with a custom helper method that retrieves 
//the user’s ID from the authentication token (JWT).