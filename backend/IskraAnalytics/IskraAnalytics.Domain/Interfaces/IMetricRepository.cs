using IskraAnalytics.Domain.Entities;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IMetricRepository
    {
        Task CreateMetricAsync(Metric metric);
        Task<List<Metric>> GetAllActiveMetricsAsync();
        Task<List<Metric>> GetAllMetricsAsync();
        Task<Metric?> GetMetricByIdAsync(Guid id);
        Task UpdateAsync(Metric metric);
    }
}