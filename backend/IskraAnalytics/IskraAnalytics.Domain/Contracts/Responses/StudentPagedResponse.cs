namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record StudentPagedResponse(
        List<StudentResponse> Students,
        int TotalCount,
        int TotalPages,
        int CurrentPage
        );
}
