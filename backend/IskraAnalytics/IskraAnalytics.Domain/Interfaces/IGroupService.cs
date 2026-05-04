using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IGroupService
    {
        Task<GroupResponse> CreateGroupAsync(CreateGroupRequest request);
        Task SoftDeleteGroupAsync(Guid id);
        Task<GroupResponse> UpdateGroupAsync(Guid id, UpdateGroupRequest request);
        Task<List<GroupResponse>> GetAllGroupsAsync();
        Task<List<GroupResponse>> GetAllActiveGroupsAsync();
        Task<GroupResponse> GetGroupByIdAsync(Guid id);
    }
}
