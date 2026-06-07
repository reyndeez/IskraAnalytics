using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Entities;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByIdAsync(Guid id);
        Task<(List<UserResponse> users, int TotalCount)> FindUsersAsync(FindUserRequest request);
        Task DeleteUserAsync(User user);
    }
}
