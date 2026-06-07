using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IskraAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StudentsController : ControllerBase
    {
        readonly IStudentService _studentService;

        public StudentsController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("find")]
        public async Task<ActionResult<StudentPagedResponse>> GetPagedStudents([FromQuery] FindStudentRequest request)
        {
            var result = await _studentService.FindStudentsAsync(request);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<ActionResult> CreateStudent([FromBody] CreateStudentRequest request)
        {
            var result = await _studentService.CreateStudentAsync(request);
            return Ok(result);
        }

        [Authorize(Roles = "User")]
        [HttpGet("my-children")]
        public async Task<ActionResult<IEnumerable<StudentResponse>>> GetChildren()
        {
            try
            {
                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userIdClaim))
                    return Unauthorized(new { message = "Пользователь не определен" });

                var userId = Guid.Parse(userIdClaim);

                var children = await _studentService.GetChildrenAsync(userId);

                return Ok(children);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Coach")]
        [HttpGet("details/{studentId}")]
        public async Task<ActionResult<StudentResponse>> GetStudentDetails(Guid studentId)
        {
            var result = await _studentService.GetStudentByIdAsync(studentId);
            return Ok(result);
        }


        [Authorize(Roles = "User")]
        [HttpPost("bind")]
        public async Task<ActionResult> BindChild([FromBody] BindChildRequest request)
        {
            if (string.IsNullOrEmpty(request.AccessCode)) return BadRequest(new {message = "Код не может быть пустым"});

            try
            {
                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userIdClaim))
                    return Unauthorized(new { message = "Пользователь не определен" });

                var userId = Guid.Parse(userIdClaim);

                await _studentService.BindChildWithParentAsync(request.AccessCode, userId);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<StudentResponse>>> GetAllStudents()
        {
            var result = await _studentService.GetAllStudentsAsync();
            return Ok(result);
        }

        [Authorize(Roles = "Coach")]
        [HttpGet("by-group/{groupId:guid}")]
        public async Task<ActionResult<IEnumerable<StudentResponse>>> GetAllStudentsByGroupId(Guid groupId)
        {
            var result = await _studentService.GetStudentsByGroupAsync(groupId);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{studentId}")]
        public async Task<ActionResult<StudentResponse>> UpdateStudentAsync(Guid studentId, [FromBody] UpdateStudentRequest request)
        {
            var result = await _studentService.UpdateStudentAsync(studentId, request);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{studentId}")]
        public async Task<IActionResult> DeleteStudentAsync(Guid studentId)
        {
            await _studentService.SoftDeleteAsync(studentId);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:guid}/restore")]
        public async Task<IActionResult> RestoreStudent(Guid id)
        {
            await _studentService.RestoreStudentAsync(id);
            return NoContent();
        }
    }
}
