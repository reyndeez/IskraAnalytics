using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IUserService
    {
        Task<UserPagedResponse> FindUserAsync(FindUserRequest request);
        Task DeleteUserAsync(Guid userId);
        Task UpdateUserRoleAsync(Guid userId, Guid newRoleId);
    }
}