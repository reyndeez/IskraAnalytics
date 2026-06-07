namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record GroupAdminResponse(
        Guid Id,
        string Name,
        bool IsActive,
        int StudentsCount,
        CoachShortResponse Coach
        );
}
