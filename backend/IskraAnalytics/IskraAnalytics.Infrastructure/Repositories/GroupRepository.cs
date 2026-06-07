using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Domain.Interfaces;
using IskraAnalytics.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IskraAnalytics.Infrastructure.Repositories
{
    public class GroupRepository : IGroupRepository
    {
        readonly IskraDbContext _dbContext;

        public GroupRepository(IskraDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //Получить группу по её Id
        public async Task<Group?> GetByIdAsync(Guid groupId)
        {
            return await _dbContext.Groups.FirstOrDefaultAsync(g => g.Id == groupId);
        }

        //Получить с фильтрацией, сортировкой, пагинацией и поиском
        public async Task<(List<GroupAdminResponse> groups, int TotalCount)> FindGroupsAsync(FindGroupRequest request)
        {
            var page = request.Page <= 0 ? 1 : request.Page;
            var pageSize = request.PageSize <= 0 ? 10 : request.PageSize;

            var query = from @group in _dbContext.Groups
                        join user in _dbContext.Users on @group.CoachId equals user.Id into userJoin
                        from coach in userJoin.DefaultIfEmpty()
                        select new { @group, coach };

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var pattern = $"%{request.Search.Trim()}%";
                query = query.Where(g => EF.Functions.ILike(g.group.Name ?? "", pattern));
            }

            // Фильтр
            var filterValue = request.Filter?.Trim().ToLower() ?? "active";

            if (filterValue == "deleted")
            {
                query = query.Where(g => !g.group.IsActive);
            }
            else if (filterValue.StartsWith("coach_"))
            {
                var coachIdString = request.Filter!.Substring(6);
                if (Guid.TryParse(coachIdString, out var coachGuid))
                {
                    query = query.Where(g => g.group.IsActive && g.group.CoachId == coachGuid);
                }
            }
            else
            {
                query = query.Where(g => g.group.IsActive);
            }

            // Сортировка
            query = request.SortId?.ToLower() switch
            {
                "name" => request.IsDescending == true
                    ? query.OrderByDescending(x => x.group.Name)
                    : query.OrderBy(x => x.group.Name),

                "coach" => request.IsDescending == true
                    ? query.OrderByDescending(x => x.coach.LastName).ThenByDescending(x => x.coach.FirstName)
                    : query.OrderBy(x => x.coach.LastName).ThenBy(x => x.coach.FirstName),

                "students_count" => request.IsDescending == true
                    ? query.OrderByDescending(x => _dbContext.Students.Count(s => s.GroupId == x.group.Id))
                    : query.OrderBy(x => _dbContext.Students.Count(s => s.GroupId == x.group.Id)),

                _ => query.OrderBy(x => x.group.Name)
            };

            var totalCount = await query.CountAsync();

            // Пагинация
            var groups = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(g => new GroupAdminResponse
                (
                    g.group.Id,
                    g.group.Name,
                    g.group.IsActive,
                    _dbContext.Students.Count(s => s.GroupId == g.group.Id),
                    new CoachShortResponse
                    (
                        g.coach.Id,
                        $"{g.coach.LastName} {g.coach.FirstName} {g.coach.Patronymic}".Trim()
                    )
                ))
                .ToListAsync();

            return (groups, totalCount);
        }

        //Получить список групп конкретного тренера
        public async Task<List<Group>> GetGroupsByCoachId(Guid coachId)
        {
            return await _dbContext.Groups.Where(g => g.CoachId == coachId && g.IsActive == true).ToListAsync();
        }

        //Получить список групп вместе со студентами по id тренера
        public async Task<List<Group>> GetGroupsWithStudentsByCoachIdAsync(Guid coachId)
        {
            return await _dbContext.Groups
                .Include(g => g.Students)
                .Where(g => g.CoachId == coachId && g.IsActive == true)
                .ToListAsync();
        }

        //Создание группы
        public async Task CreateGroupAsync(Group group)
        {
            await _dbContext.Groups.AddAsync(group);
            await _dbContext.SaveChangesAsync();
        }

        //Сохранение любых изменений, мягкое удаление
        public async Task UpdateAsync(Group group)
        {
            _dbContext.Update(group);
            await _dbContext.SaveChangesAsync();
        }

        //Получить все "активные" группы
        public async Task<List<Group>> GetAllActiveGroupsAsync()
        {
            return await _dbContext.Groups.Where(g =>  g.IsActive).ToListAsync();
        }

        //Получить все группы
        public async Task<List<Group>> GetAllGroupsAsync()
        {
            return await _dbContext.Groups.ToListAsync();
        }

        //Получить группу по id воспитанника
        public async Task<Group?> GetGroupByStudentId(Guid studentId)
        {
            return await _dbContext.Groups
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.IsActive == true && g.Students.Any(s => s.Id == studentId));
        }

        //Восстановить группу
        public async Task RestoreAsync(Guid id)
        {
            var group = await _dbContext.Groups.FirstOrDefaultAsync(g => g.Id == id);
            if (group != null)
            {
                group.IsActive = true;
                _dbContext.Groups.Update(group);
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
