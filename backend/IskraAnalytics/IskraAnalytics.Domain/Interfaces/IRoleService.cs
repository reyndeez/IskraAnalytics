using IskraAnalytics.Domain.Contracts.Responses;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IRoleService
    {
        Task<List<RoleResponse>> GetAllRolesAsync();
    }
}