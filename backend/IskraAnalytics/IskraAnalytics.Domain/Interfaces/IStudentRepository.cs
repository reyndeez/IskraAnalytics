using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Entities;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IStudentRepository
    {
        Task CreateAsync(Student student);
        Task<Student?> GetByAccessCodeAsync(string code);
        Task<Student?> GetStudentByIdAsync(Guid studentId);
        Task UpdateAsync(Student student);
        Task<List<Student>> GetAllActiveAsync();
        Task<List<Student>> GetStudentsByGroupIdAsync(Guid groupId);
        Task<List<Student>> GetChildrenAsync(Guid userId);
        Task<(List<StudentResponse> students, int TotalCount)> FindStudentsAsync(FindStudentRequest request);
        Task RestoreStudentAsync(Guid id);
    }
}