namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record GroupPagedResponse(
        List<GroupAdminResponse> Groups,
        int TotalCount,
        int TotalPages,
        int CurrentPage
        );
}
