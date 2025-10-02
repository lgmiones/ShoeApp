using System.Security.Claims;
using ShoeShopAPI.DTOs;

namespace ShoeShopAPI.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);   // always Customer
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<AuthResponseDto?> MeAsync(ClaimsPrincipal user);
    }
}
