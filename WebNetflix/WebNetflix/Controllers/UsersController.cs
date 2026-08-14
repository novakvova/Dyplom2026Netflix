using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebNetflix.Models.Users;

namespace WebNetflix.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class UsersController(AppDbNetflixContext appDbNetflix) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List()
    {
        List<UserItem> list = await appDbNetflix.Users
            .Select(x => new UserItem
            {
                Id = x.Id,
                Email = x.Email,
                FullName = $"{x.LastName} {x.FirstName}",
                DateCreated = x.DateCreated.ToString("dd.MM.yyyy")
            })
            .ToListAsync();
        return Ok(list);
    }
}
