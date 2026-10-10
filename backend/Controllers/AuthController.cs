using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace TicketingApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;

    public AuthController(IConfiguration config) => _config = config;

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        // في الواقع ستتحقق من قاعدة البيانات + Hash كلمة المرور
        if (request.Username == "admin" && request.Password == "admin123")
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!";
            var issuer = jwtSettings["Issuer"] ?? "TicketingApi";
            var audience = jwtSettings["Audience"] ?? "TicketingApp";
            var expiryMinutes = int.Parse(jwtSettings["ExpiryMinutes"] ?? "60");

            // إنشاء Claims (بيانات المستخدم داخل الـ JWT)
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, request.Username),
                new Claim(ClaimTypes.Role, "Admin"),
                new Claim("userId", "1")
            };

            // إنشاء المفتاح السري
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // إنشاء الـ JWT
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: credentials
            );

            return Ok(new 
            { 
                token = new JwtSecurityTokenHandler().WriteToken(token),
                message = "تم تسجيل الدخول بنجاح",
                expiresIn = $"{expiryMinutes} دقيقة"
            });
        }

        return Unauthorized(new { message = "بيانات الاعتماد غير صحيحة" });
    }
}

public record LoginRequest(string Username, string Password);
