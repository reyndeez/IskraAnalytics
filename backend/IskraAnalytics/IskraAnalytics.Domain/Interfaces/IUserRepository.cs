using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Entities;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByIdAsync(Guid id);
        Task<(List<UserResponse> users, int TotalCount)> FindUsersAsync(
            string? search,
            string? roleId,
            string? sortId,
            bool? isDescending,
            int page,
            int pageSize);
    }
}
