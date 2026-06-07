using IskraAnalytics.Domain.Enums;

namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record MetricResponse(
        Guid Id,
        string Name,
        string Description,
        string Recommendation,
        Units Unit,
        bool IsActive
        );
}
