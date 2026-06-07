namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record LeaderBoardResponse(
        int Rank,
        Guid StudentId,
        string StudentName,
        double Score,
        string CreatedAt,  
        double LastScore,     
        string LastCreatedAt,
        string Unit,
        bool IsSelectedChild
    );

}
