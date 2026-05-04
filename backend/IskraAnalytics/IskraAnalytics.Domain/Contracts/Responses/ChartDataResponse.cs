namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record ChartDataResponse(
        string CreatedAt,
        double Value,
        double AvgValue
        );
}
