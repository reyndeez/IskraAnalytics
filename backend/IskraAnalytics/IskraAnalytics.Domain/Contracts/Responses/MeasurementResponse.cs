using IskraAnalytics.Domain.Enums;

namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record MeasurementResponse(
        Guid? ResultId,
        StudentShortResponse Student,
        double Value,
        string Unit
        );
}
