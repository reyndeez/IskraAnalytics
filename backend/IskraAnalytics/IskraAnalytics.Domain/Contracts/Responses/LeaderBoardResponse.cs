namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record LeaderBoardResponse(
        int Rank,
        Guid StudentId,
        string StudentName,
        double Score,
        string Unit,
        string CreatedAt,
        bool IsSelectedChild
        );

}
