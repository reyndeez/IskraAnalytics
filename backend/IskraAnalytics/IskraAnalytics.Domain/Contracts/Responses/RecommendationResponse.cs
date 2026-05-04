using IskraAnalytics.Domain.Enums;

namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record RecommendationResponse(
        string Name,
        string? Description,
        string? Recommendation,
        string Unit
        );
}
