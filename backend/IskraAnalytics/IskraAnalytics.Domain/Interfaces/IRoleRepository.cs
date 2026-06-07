using Microsoft.AspNetCore.Identity;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IRoleRepository
    {
        Task<List<IdentityRole<Guid>>> GetAllRolesAsync();
        Task<IdentityRole<Guid>?> GetRoleByIdAsync(Guid roleId);
    }
}