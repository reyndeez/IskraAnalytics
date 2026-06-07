using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IStudentService
    {
        Task<StudentPagedResponse> FindStudentsAsync(FindStudentRequest request);
        Task<StudentResponse> CreateStudentAsync(CreateStudentRequest request);
        Task SoftDeleteAsync(Guid studentId);
        Task<List<StudentResponse>> GetStudentsByGroupAsync(Guid groupId);
        Task<List<StudentResponse>> GetAllStudentsAsync();
        Task<StudentResponse> UpdateStudentAsync(Guid studentId, UpdateStudentRequest request);
        Task BindChildWithParentAsync(string code, Guid userId);
        Task<List<StudentResponse>> GetChildrenAsync(Guid userId);
        Task<StudentResponse> GetStudentByIdAsync(Guid studentId);
        Task RestoreStudentAsync(Guid id);
    }
}