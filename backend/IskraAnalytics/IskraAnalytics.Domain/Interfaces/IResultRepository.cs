using IskraAnalytics.Domain.Entities;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IResultRepository
    {
        Task CreateResultAsync(Result result);
        Task<List<Result>> GetAllResultByStudentIdAsync(Guid studentId);
        Task<Result?> GetResultByIdAsync(Guid id);
        Task UpdateResultAsync(Result result);
        Task DeleteResultAsync(Result result);
        Task<List<Result>> GetResultsByGroupAndMetric(Guid groupId, Guid metricId);
        Task<List<Result>> GetResultsByStudentAndMetric(Guid studentId, Guid metricId);
    }
}