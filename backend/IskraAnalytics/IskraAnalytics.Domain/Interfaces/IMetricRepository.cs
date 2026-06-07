using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Entities;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IMetricRepository
    {
        Task CreateMetricAsync(Metric metric);
        Task<List<Metric>> GetAllActiveMetricsAsync();
        Task<List<Metric>> GetAllMetricsAsync();
        Task<(List<MetricResponse> metrics, int TotalCount)> FindMetricsAsync(FindMetricRequest request);
        Task<Metric?> GetMetricByIdAsync(Guid id);
        Task UpdateAsync(Metric metric);
        Task RestoreMetricAsync(Guid id);
    }
}