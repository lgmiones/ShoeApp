namespace ShoeShopAPI.DTOs
{
    public class RegisterDto
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string? Role { get; set; } // "Customer" (default) or "Admin"
    }

    public class LoginDto
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = "";
        public DateTime ExpiresAt { get; set; }
        public string Email { get; set; } = "";
        public string[] Roles { get; set; } = Array.Empty<string>();
    }
}
