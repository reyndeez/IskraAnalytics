using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Entities;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IGroupRepository
    {
        Task<Group?> GetByIdAsync(Guid groupId);
        Task<List<Group>> GetGroupsByCoachId(Guid coachId);
        Task<List<Group>> GetGroupsWithStudentsByCoachIdAsync(Guid coachId);
        Task CreateGroupAsync(Group group);
        Task UpdateAsync(Group group);
        Task<List<Group>> GetAllActiveGroupsAsync();
        Task<List<Group>> GetAllGroupsAsync();
        Task<Group?> GetGroupByStudentId(Guid studentId);
        Task<(List<GroupAdminResponse> groups, int TotalCount)> FindGroupsAsync(FindGroupRequest request);
        Task RestoreAsync(Guid id);
    }
}