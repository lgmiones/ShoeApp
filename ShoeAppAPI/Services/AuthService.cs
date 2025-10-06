using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using ShoeShopAPI.DTOs;
using ShoeShopAPI.Models;
using ShoeShopAPI.Services.Interfaces;

namespace ShoeShopAPI.Services
{
    // AuthService: handles user authentication (register, login, token generation)
    public class AuthService : IAuthService
    {
        private readonly UserManager<AppUser> _users;
        private readonly SignInManager<AppUser> _signIn;
        private readonly RoleManager<IdentityRole<int>> _roles;
        private readonly IConfiguration _config;


        public AuthService(
            UserManager<AppUser> users,
            SignInManager<AppUser> signIn,
            RoleManager<IdentityRole<int>> roles,
            IConfiguration config)
        {
            _users = users;
            _signIn = signIn;
            _roles = roles;
            _config = config;
        }

        // REGISTER: create a new user account
        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var user = new AppUser { UserName = dto.Email, Email = dto.Email };
            var create = await _users.CreateAsync(user, dto.Password);

            if (!create.Succeeded)
            {
                var msg = string.Join("; ", create.Errors.Select(e => e.Description));
                throw new InvalidOperationException(msg);
            }

            const string role = "Customer";
            if (!await _roles.RoleExistsAsync(role))
                await _roles.CreateAsync(new IdentityRole<int>(role));
            await _users.AddToRoleAsync(user, role);

            return await IssueTokenAsync(user);
        }

        // LOGIN: validate user credentials
        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _users.FindByEmailAsync(dto.Email)
                ?? throw new UnauthorizedAccessException("Invalid credentials.");


            var signIn = await _signIn.CheckPasswordSignInAsync(user, dto.Password, lockoutOnFailure: false);
            if (!signIn.Succeeded) throw new UnauthorizedAccessException("Invalid credentials.");


            return await IssueTokenAsync(user);
        }


        public async Task<AuthResponseDto?> MeAsync(ClaimsPrincipal principal)
        {
            var user = await _users.GetUserAsync(principal); // extract user from token claims
            return user is null ? null : await IssueTokenAsync(user); // return token info again
        }

        // Helper: issue a JWT for the given user
        private async Task<AuthResponseDto> IssueTokenAsync(AppUser user)
        {
            var roles = (await _users.GetRolesAsync(user)).ToArray();

            var jwt = _config.GetSection("Jwt");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(double.Parse(jwt["ExpiresMinutes"]!));

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()), // subject: user ID
                new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty), // email
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),  // identity ID
                new(ClaimTypes.Name, user.Email ?? string.Empty)     // username/email
            };

            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));


            var token = new JwtSecurityToken(
                issuer: jwt["Issuer"],
                audience: jwt["Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new AuthResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiresAt = expires,
                Email = user.Email ?? string.Empty,
                Roles = roles
            };
        }
    }
}
