using IskraAnalytics.Domain.Entities;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IStudentRepository
    {
        Task CreateAsync(Student student);
        Task<Student?> GetByAccessCodeAsync(string code);
        Task<Student?> GetByIdAsync(Guid id);
        Task UpdateAsync(Student student);
        Task<List<Student>> GetAllActiveAsync();
        Task<List<Student>> GetStudentsByGroupIdAsync(Guid grouId);
        Task<List<Student>> GetChildrenAsync(Guid userId);
    }
}