namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record ResultResponse(
        Guid Id,
        double Value,
        string CreatedAt,
        StudentShortResponse Student,
        CoachShortResponse Coach,
        MetricResponse Metric
        );
}
