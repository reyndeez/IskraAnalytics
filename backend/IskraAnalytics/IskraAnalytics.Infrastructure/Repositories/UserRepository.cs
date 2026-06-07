using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Domain.Interfaces;
using IskraAnalytics.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace IskraAnalytics.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        readonly IskraDbContext _dbContext;
        readonly UserManager<User> _userManager;
        public UserRepository(IskraDbContext dbContext, UserManager<User> userManager) 
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        //Получить пользователя по id
        public async Task<User?> GetUserByIdAsync(Guid id)
        {
             return await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
        }

        //Получить с фильтрацией, сортировкой, пагинацией и поиском
        public async Task<(List<UserResponse> users, int TotalCount)> FindUsersAsync(FindUserRequest request)
        {
            var page = request.Page <= 0 ? 1 : request.Page;
            var pageSize = request.PageSize <= 0 ? 10 : request.PageSize;

            var query = from user in _dbContext.Users
                        join userRole in _dbContext.UserRoles on user.Id equals userRole.UserId
                        join role in _dbContext.Roles on userRole.RoleId equals role.Id
                        select new { user, role };

            //Поиск
            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var pattern = $"%{request.Search.Trim()}%";

                query = query.Where(u =>
                    EF.Functions.ILike(u.user.Email ?? "", pattern) ||
                    EF.Functions.ILike(u.user.FirstName ?? "", pattern) ||
                    EF.Functions.ILike(u.user.LastName ?? "", pattern) ||
                    EF.Functions.ILike(u.user.Patronymic ?? "", pattern)
                );
            }

            //Фильтр
            if (!string.IsNullOrEmpty(request.RoleId))
            {
                if (Guid.TryParse(request.RoleId, out var roleGuid))
                {
                    query = query.Where(u => u.role.Id == roleGuid);
                }
            }

            //Сортировка
            query = request.SortId switch
            {
                "name" => request.IsDescending == true
                    ? query.OrderByDescending(x => x.user.FirstName)
                    : query.OrderBy(x => x.user.FirstName),

                "role" => request.IsDescending == true
                    ? query.OrderByDescending(x => x.role.Name)
                    : query.OrderBy(x => x.role.Name),

                "date" => request.IsDescending == true
                    ? query.OrderByDescending(x => x.user.CreatedAt)
                    : query.OrderBy(x => x.user.CreatedAt),

                _ => query.OrderBy(x => x.user.FirstName)
            };

            var totalCount = await query.CountAsync();

            //Пагинация
            var users = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserResponse
                (
                    u.user.Id,
                    u.user.FirstName,
                    u.user.LastName,
                    u.user.Patronymic ?? "",
                    u.user.Email ?? "",
                    u.role.Name ?? ""
                )).ToListAsync();

            return (users, totalCount);
        }

        //Удалить пользователя
        public async Task DeleteUserAsync(User user)
        {
            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                throw new Exception("Ошибка при удалении пользователя через Identity");
            }
        }
    }
}
