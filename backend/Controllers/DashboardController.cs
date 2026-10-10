using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace TicketingApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]  // ← هذا المتحكم محمي — يحتاج JWT صالح
public class DashboardController : ControllerBase
{
    [HttpGet]
    public IActionResult GetDashboard()
    {
        var username = User.FindFirstValue(ClaimTypes.Name);
        var role = User.FindFirstValue(ClaimTypes.Role);

        return Ok(new 
        {
            message = $"مرحبًا، {username}!",
            role = role,
            tickets = new[] {
                new { id = 1, title = "خطأ في الطباعة", status = "مفتوحة" },
                new { id = 2, title = "طلب صيانة", status = "قيد المعالجة" },
                new { id = 3, title = "مشكلة شبكة", status = "مغلقة" }
            }
        });
    }
}
