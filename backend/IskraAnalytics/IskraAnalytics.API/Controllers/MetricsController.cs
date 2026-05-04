using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IskraAnalytics.API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    //[Authorize(Roles = "Admin")]
    public class MetricsController : ControllerBase
    {
        readonly IMetricService _metricService;

        public MetricsController(IMetricService metricService)
        {
            _metricService = metricService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MetricResponse>>> GetAllMetrics()
        {
            var result = await _metricService.GetAllMetricsAsync();
            return Ok(result);
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<MetricResponse>>> GetAllActiveMetrics()
        {
            var result =  await _metricService.GetAllActiveMetricsAsync();
            return Ok(result);
        }

        [HttpPost("create")]
        public async Task<ActionResult<MetricResponse>> CreateMetric([FromBody] CreateMetricRequest request)
        {
            var result = await _metricService.CreateMetricAsync(request);
            return Ok(result);
        }

        [HttpPut("{metricId}")]
        public async Task<ActionResult> UpdateMetric(Guid metricId, [FromBody] UpdateMetricRequest request)
        {
            var result = await _metricService.UpdateMetricAsync(metricId, request);
            return Ok(result);
        }

        [HttpDelete("delete/{metricId}")]
        public async Task<IActionResult> DeleteMetric(Guid metricId)
        {
            await _metricService.SoftDeleteMetricAsync(metricId);
            return NoContent();
        }
    }
}
