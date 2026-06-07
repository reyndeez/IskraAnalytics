using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IMetricService
    {
        Task<MetricPagedResponse> FindMetricsAsync(FindMetricRequest request);
        Task<MetricResponse> CreateMetricAsync(CreateMetricRequest request);
        Task<List<MetricResponse>> GetAllActiveMetricsAsync();
        Task<List<MetricResponse>> GetAllMetricsAsync();
        Task<MetricResponse> GetMetricByIdAsync(Guid id);
        Task SoftDeleteMetricAsync(Guid id);
        Task<MetricResponse> UpdateMetricAsync(Guid id, UpdateMetricRequest request);
        Task<List<MetricSelectorResponse>> GetMetricsForSelectorAsync();
        Task RestoreMetricAsync(Guid id);
    }
}