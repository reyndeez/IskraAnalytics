using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace IskraAnalytics.Application.Services
{
    public class UserService : IUserService
    {
        readonly IUserRepository _userRepository;
        readonly IRoleRepository _roleRepository;
        readonly UserManager<User> _userManager;

        public UserService(IUserRepository userRepository, IRoleRepository roleRepository, UserManager<User> userManager)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _userManager = userManager;
        }

        //Найти пользователя
        public async Task<UserPagedResponse> FindUserAsync(FindUserRequest request)
        {
            var (users, totalCount) = await _userRepository.FindUsersAsync(request);
            var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

            return new UserPagedResponse(
                Users: users,
                TotalCount: totalCount,
                TotalPages: totalPages,
                CurrentPage: request.Page
                );
        }

        //Удалить пользователя
        public async Task DeleteUserAsync(Guid userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("Пользователь с таким id не найден");
            }

            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Select(r => r.ToLower()).Contains("admin"))
            {
                throw new Exception("Нельзя удалить учётную запись администратора");
            }
            
            await _userRepository.DeleteUserAsync(user);
        }

        //Обновить роль пользователя
        public async Task UpdateUserRoleAsync(Guid userId, Guid newRoleId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);

            if (user == null)
            {
                throw new Exception("Пользователь с таким id не найден");
            }

            var role = await _roleRepository.GetRoleByIdAsync(newRoleId);
            if (role == null) throw new Exception("Роль не найдена");

            var currentRoles = await _userManager.GetRolesAsync(user);
            var currentRole = currentRoles.FirstOrDefault();

            if (currentRole != null && currentRole.ToLower() == "admin")
            {
                throw new Exception("Запрещено измнять роль администратора");
            }

            if (string.Equals(currentRole, role.Name, StringComparison.OrdinalIgnoreCase))
            {
                return;
            }

            if(currentRole != null)
            {
                await _userManager.RemoveFromRoleAsync(user, currentRole);
            }

            var result = await _userManager.AddToRoleAsync(user, role.Name!);
            if (!result.Succeeded)
            {
                throw new Exception("Ошибка при назначении новой роли");
            }
        }
    }
}
