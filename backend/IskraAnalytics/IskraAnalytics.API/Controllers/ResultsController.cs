using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IskraAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize(Roles = "Coach")]
    public class ResultsController : ControllerBase
    {
        readonly IResultService _resultService;
        public ResultsController(IResultService resultService)
        {
            _resultService = resultService;
        }

        [HttpGet("{studentId}")]
        public async Task<ActionResult<IEnumerable<ResultResponse>>> GetResultsByStudentId(Guid studentId)
        {
            var result = await _resultService.GetAllResultsByStudentId(studentId);
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

        [HttpDelete("delete/{resultId}")]
        public async Task<IActionResult> DeleteResult(Guid resultId)
        {
            await _resultService.DeleteResultAsync(resultId);
            return NoContent();
        }
    }
}
