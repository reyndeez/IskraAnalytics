using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IskraAnalytics.API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize]
    public class MetricsController : ControllerBase
    {
        readonly IMetricService _metricService;

        public MetricsController(IMetricService metricService)
        {
            _metricService = metricService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("find")]
        public async Task<ActionResult<MetricPagedResponse>> GetPagedMetrics([FromQuery] FindMetricRequest request)
        {
            var result = await _metricService.FindMetricsAsync(request);
            return Ok(result);
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

        [HttpGet("selector")]
        public async Task<ActionResult<IEnumerable<MetricSelectorResponse>>> GetMetricsForSelector()
        {
            var result = await _metricService.GetMetricsForSelectorAsync();
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("create")]
        public async Task<ActionResult<MetricResponse>> CreateMetric([FromBody] CreateMetricRequest request)
        {
            var result = await _metricService.CreateMetricAsync(request);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{metricId}")]
        public async Task<ActionResult> UpdateMetric(Guid metricId, [FromBody] UpdateMetricRequest request)
        {
            var result = await _metricService.UpdateMetricAsync(metricId, request);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete/{metricId}")]
        public async Task<IActionResult> DeleteMetric(Guid metricId)
        {
            await _metricService.SoftDeleteMetricAsync(metricId);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:guid}/restore")]
        public async Task<IActionResult> RestoreMetric(Guid id)
        {
            await _metricService.RestoreMetricAsync(id);
            return NoContent();
        }
    }
}
