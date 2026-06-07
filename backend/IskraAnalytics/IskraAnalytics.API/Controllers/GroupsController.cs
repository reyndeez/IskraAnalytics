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
    [Authorize]
    public class GroupsController : ControllerBase
    {
        readonly IGroupService _groupService;
        readonly UserManager<User> _userManager;
        public GroupsController(IGroupService groupService, UserManager<User> userManager) 
        {
            _groupService = groupService;
            _userManager = userManager;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("find")]
        public async Task<ActionResult<GroupPagedResponse>> GetPagedGroups([FromQuery] FindGroupRequest request)
        {
            var result = await _groupService.FindGroupsAsync(request);
            return Ok(result);
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<GroupResponse>>> GetAllActiveGroups()
        {
            var result = await _groupService.GetAllActiveGroupsAsync();
            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GroupResponse>>> GetAllGroups()
        {
            var result = await _groupService.GetAllGroupsAsync();
            return Ok(result);
        }

        [Authorize(Roles = "Coach")]
        [HttpGet("my-groups")]
        public async Task<ActionResult<IEnumerable<GroupResponse>>> GetGroupsByCoachId()
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null) return Unauthorized();
            var result = await _groupService.GetGroupsByCoachIdAsync(user.Id);
            return Ok(result);
        }

        [Authorize(Roles = "Coach")]
        [HttpGet("my-groups-with-students")]
        public async Task<ActionResult<IEnumerable<GroupWithStudentsResponse>>> GetGroupsWithStudentsByCoachId()
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null) return Unauthorized();
            var result = await _groupService.GetGroupsWithStudentsByCoachIdAsync(user.Id);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("create")]
        public async Task<ActionResult> CreateGroup([FromBody] CreateGroupRequest request)
        {
            var result = await _groupService.CreateGroupAsync(request);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{groupId}")]
        public async Task<ActionResult<GroupResponse>> UpdateGroup(Guid groupId, [FromBody] UpdateGroupRequest request)
        {
            var result = await _groupService.UpdateGroupAsync(groupId, request);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete/{groupId}")]
        public async Task<IActionResult> DeleteGroup(Guid groupId)
        {
            await _groupService.SoftDeleteGroupAsync(groupId);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:guid}/restore")]
        public async Task<IActionResult> RestoreGroup(Guid id)
        {
            await _groupService.RestoreGroupAsync(id);
            return NoContent();
        }
    }
}
