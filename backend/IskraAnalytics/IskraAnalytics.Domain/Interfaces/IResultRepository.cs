using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Entities;
using System.Text.RegularExpressions;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
        Task<List<Result>> GetResultsForMeasurementAsync(Guid groupId, Guid metricId, DateTime date, Metric metric);
        Task<Guid> UpsertResultAsync(Guid? resultId, Guid studentId, Guid metricId, DateTime date, double value, Guid coachId);
    }
}