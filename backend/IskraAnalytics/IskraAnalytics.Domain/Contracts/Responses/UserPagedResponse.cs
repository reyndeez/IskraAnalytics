namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record UserPagedResponse(
        List<UserResponse> Users,
        int TotalCount,
        int TotalPages,
        int CurrentPage
        );
}
