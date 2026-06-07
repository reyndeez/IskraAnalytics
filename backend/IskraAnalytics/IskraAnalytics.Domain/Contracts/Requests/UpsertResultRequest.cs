namespace IskraAnalytics.Domain.Contracts.Requests
{
    public record UpsertResultRequest(
        Guid? ResultId,
        Guid StudentId,
        Guid MetricId,
        DateTime Date,
        double Value
        );
}
