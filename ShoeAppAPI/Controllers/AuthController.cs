using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoeShopAPI.DTOs;
using ShoeShopAPI.Services.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth) => _auth = auth;

    // ------------------------- REGISTER -------------------------
    [HttpPost("register")] // Endpoint: POST api/auth/register
    [AllowAnonymous] // Accessible without authentication
    public Task<AuthResponseDto> Register(RegisterDto dto)
        => _auth.RegisterAsync(dto);

    // ------------------------- LOGIN -------------------------
    [HttpPost("login")]
    [AllowAnonymous]
    public Task<AuthResponseDto> Login(LoginDto dto)
        => _auth.LoginAsync(dto);

    // ------------------------- ME (CURRENT USER) -------------------------
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<AuthResponseDto>> Me()
        => (await _auth.MeAsync(User)) is { } me
            ? me
            : Unauthorized();
}
