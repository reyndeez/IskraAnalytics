namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record RatingOverallResponse(
                int Rank,
        Guid StudentId,
        string StudentName,
        double Score,
        string Unit,
        bool IsSelectedChild
        );
}
