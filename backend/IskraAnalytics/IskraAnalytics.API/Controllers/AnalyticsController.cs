using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IskraAnalytics.API.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        readonly IAnalyticService _analyticsService;
        public AnalyticsController(IAnalyticService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        [HttpGet("leaderboard")]
        public async Task<ActionResult<List<LeaderBoardResponse>>> GetLeaderBoard([FromQuery] LeaderBoardRequest request)
        {
            try
            {
                var result = await _analyticsService.GetRatingAsync(request.MetricId, request.StudentId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("chart")]
        public async Task<ActionResult<List<LeaderBoardResponse>>> GetChartData([FromQuery] ChartDataRequest request)
        {
            try
            {
                var result = await _analyticsService.GetChartDataAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("ratingOverall")]
        public async Task<ActionResult<List<LeaderBoardResponse>>> GetRatingOverall([FromQuery] Guid studentId)
        {
            try
            {
                var result = await _analyticsService.GetRatingOverall(studentId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("recommendations")]
        public async Task<ActionResult<List<RecommendationResponse>>> GetRecommendations([FromQuery]RecommendationRequest request)
        {
            try
            {
                var result = await _analyticsService.GetRecommendations(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
