using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace IskraAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Coach")]
    public class ResultsController : ControllerBase
    {
        readonly IResultService _resultService;
        readonly UserManager<User> _userManager;
        public ResultsController(IResultService resultService, UserManager<User> userManager)
        {
            _resultService = resultService;
            _userManager = userManager;
        }

        [HttpGet("{studentId}")]
        public async Task<ActionResult<IEnumerable<ResultResponse>>> GetResultsByStudentId(Guid studentId)
        {
            var result = await _resultService.GetAllResultsByStudentId(studentId);
            return Ok(result);
        }

        [HttpGet("measurements")]
        public async Task<ActionResult<IEnumerable<MeasurementResponse>>> GetResultsForMeasurement([FromQuery] MeasurementRequest request)
        {
            if (!DateTime.TryParse(request.Date, out var parsedDate))
            {
                parsedDate = DateTime.Today;
            }
            var utcDate = DateTime.SpecifyKind(parsedDate, DateTimeKind.Utc);

            var result = await _resultService.GetResultsForMeasurementAsync(
                request.GroupId,
                request.MetricId,
                utcDate);

            return Ok(result);
        }

        [HttpPut("{resultId}")]
        public async Task<ActionResult<ResultResponse>> UpdateResult(Guid resultId, UpdateResultRequest request)
        {
            var result = await _resultService.UpdateResultAsync(resultId, request);
            return Ok(result);
        }

        [HttpPost("create")]
        public async Task<ActionResult<ResultResponse>> CreateResult(CreateResultRequest request)
        {
            var result = await _resultService.CreateResult(request);
            return Ok(result);
        }

        [HttpPost("upsert")]
        public async Task<ActionResult<Guid>> UpsertResult([FromBody] UpsertResultRequest request)
        {
            var coach = await _userManager.GetUserAsync(User);

            if (coach == null)
            {
                return Unauthorized("Тренер не найден в системе");
            }

            try
            {
                var resultId = await _resultService.UpsertResultAsync(request, coach.Id);
                return Ok(resultId);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("delete/{resultId}")]
        public async Task<IActionResult> DeleteResult(Guid resultId)
        {
            await _resultService.DeleteResultAsync(resultId);
            return NoContent();
        }
    }
}
