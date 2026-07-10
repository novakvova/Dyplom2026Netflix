using Domain.Entities.Identity;

namespace WebNetflix.Interfaces;

public interface IJwtTokenService
{
    Task<string> CreateTokenAsync(UserEntity user);
}
