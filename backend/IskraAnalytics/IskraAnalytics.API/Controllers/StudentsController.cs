using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IskraAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize(Roles = "Coach")]
    public class StudentsController : ControllerBase
    {
        readonly IStudentService _studentService;

        public StudentsController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        [HttpPost("register")]
        public async Task<ActionResult> CreateStudent([FromBody] CreateStudentRequest request)
        {
            var result = await _studentService.CreateStudentAsync(request);
            return Ok(result);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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


        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentResponse>>> GetAllStudents()
        {
            var result = await _studentService.GetAllStudentsAsync();
            return Ok(result);
        }

        //[HttpGet("{studentId}")]
        //public async Task<StudentResponse> GetStudentById(Guid studentId)
        //{

        //}

        [HttpGet("{groupId}")]
        public async Task<ActionResult<IEnumerable<StudentResponse>>> GetAllStudentsByGroupId(Guid id)
        {   
            var result = await _studentService.GetStudentsByGroupAsync(id);
            return Ok(result);
        }

        [HttpPut("{studentId}")]
        public async Task<ActionResult<StudentResponse>> UpdateStudentAsync(Guid studentId, UpdateStudentRequest request)
        {
            var result = await _studentService.UpdateStudentAsync(studentId, request);
            return Ok(result);
        }

        [HttpDelete("{studentId}")]
        public async Task<IActionResult> DeleteStudentAsync(Guid studentId)
        {
            await _studentService.SoftDeleteAsync(studentId);
            return NoContent();
        }
    }
}
