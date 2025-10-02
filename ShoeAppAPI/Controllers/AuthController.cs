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

    [HttpPost("register")]
    [AllowAnonymous]
    public Task<AuthResponseDto> Register(RegisterDto dto) => _auth.RegisterAsync(dto);

    [HttpPost("login")]
    [AllowAnonymous]
    public Task<AuthResponseDto> Login(LoginDto dto) => _auth.LoginAsync(dto);

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<AuthResponseDto>> Me()
        => (await _auth.MeAsync(User)) is { } me ? me : Unauthorized();
}
