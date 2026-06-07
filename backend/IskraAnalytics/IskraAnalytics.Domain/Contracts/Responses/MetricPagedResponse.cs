namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record MetricPagedResponse(
        List<MetricResponse> Metrics,
        int TotalCount,
        int TotalPages,
        int CurrentPage
        );
}
