using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IAnalyticService
    {
        Task<List<LeaderBoardResponse>> GetRatingAsync(Guid metricId, Guid studentId);
        Task<List<ChartDataResponse>> GetChartDataAsync(ChartDataRequest request); 
        Task<List<RatingOverallResponse>> GetRatingOverall(Guid studentId);
        Task<List<RecommendationResponse>> GetRecommendations(RecommendationRequest request);
    }
}