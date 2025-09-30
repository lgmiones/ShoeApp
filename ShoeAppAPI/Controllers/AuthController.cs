using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ShoeShopAPI.DTOs;
using ShoeShopAPI.Models;

namespace ShoeShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userMgr;
        private readonly SignInManager<AppUser> _signInMgr;
        private readonly IConfiguration _config;
        private readonly RoleManager<IdentityRole<int>> _roleMgr;

        public AuthController(
            UserManager<AppUser> userMgr,
            SignInManager<AppUser> signInMgr,
            RoleManager<IdentityRole<int>> roleMgr,
            IConfiguration config)
        {
            _userMgr = userMgr;
            _signInMgr = signInMgr;
            _roleMgr = roleMgr;
            _config = config;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
        {
            var user = new AppUser { UserName = dto.Email, Email = dto.Email };
            var result = await _userMgr.CreateAsync(user, dto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            var role = string.IsNullOrWhiteSpace(dto.Role) ? "Customer" : dto.Role!;
            if (!await _roleMgr.RoleExistsAsync(role)) return BadRequest("Invalid role.");
            await _userMgr.AddToRoleAsync(user, role);

            return await IssueToken(user);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            var user = await _userMgr.FindByEmailAsync(dto.Email);
            if (user == null) return Unauthorized("Invalid credentials.");

            var result = await _signInMgr.CheckPasswordSignInAsync(user, dto.Password, lockoutOnFailure: false);
            if (!result.Succeeded) return Unauthorized("Invalid credentials.");

            return await IssueToken(user);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<AuthResponseDto>> Me()
        {
            var user = await _userMgr.GetUserAsync(User);
            if (user == null) return Unauthorized();
            return await IssueToken(user); // fresh roles + expiry snapshot
        }

        private async Task<AuthResponseDto> IssueToken(AppUser user)
        {
            var roles = (await _userMgr.GetRolesAsync(user)).ToArray();
            var jwtSection = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!));

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Email ?? "")
            };
            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSection["ExpiresMinutes"]!));

            var token = new JwtSecurityToken(
                issuer: jwtSection["Issuer"],
                audience: jwtSection["Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds);

            return new AuthResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiresAt = expires,
                Email = user.Email ?? "",
                Roles = roles
            };
        }
    }
}
