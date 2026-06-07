namespace IskraAnalytics.Domain.Contracts.Requests
{
    public record MeasurementRequest(
        Guid GroupId,
        Guid MetricId,
        string Date
        );
}
