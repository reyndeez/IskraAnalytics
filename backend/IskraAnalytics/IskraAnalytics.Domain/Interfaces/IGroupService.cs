using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IGroupService
    {
        Task<GroupPagedResponse> FindGroupsAsync(FindGroupRequest request);
        Task<GroupResponse> CreateGroupAsync(CreateGroupRequest request);
        Task SoftDeleteGroupAsync(Guid id);
        Task<GroupResponse> UpdateGroupAsync(Guid id, UpdateGroupRequest request);
        Task<List<GroupResponse>> GetAllGroupsAsync();
        Task<List<GroupResponse>> GetAllActiveGroupsAsync();
        Task<GroupResponse> GetGroupByIdAsync(Guid id);
        Task<List<GroupResponse>> GetGroupsByCoachIdAsync(Guid coachId);
        Task<List<GroupWithStudentsResponse>> GetGroupsWithStudentsByCoachIdAsync(Guid coachId);
        Task RestoreGroupAsync(Guid id);
    }
}
