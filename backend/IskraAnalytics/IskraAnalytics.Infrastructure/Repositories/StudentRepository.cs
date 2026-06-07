using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Domain.Enums;
using IskraAnalytics.Domain.Interfaces;
using IskraAnalytics.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IskraAnalytics.Infrastructure.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        readonly IskraDbContext _dbContext;

        public StudentRepository(IskraDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //Создание воспитанника
        public async Task CreateAsync(Student student)
        {
            await _dbContext.Students.AddAsync(student);
            await _dbContext.SaveChangesAsync();
        }

        //Получить воспитанника по Id
        public async Task<Student?> GetStudentByIdAsync(Guid id)
        {
            return await _dbContext.Students.Include(s => s.Group).FirstOrDefaultAsync(s => s.Id == id);
        }

        //Получить воспитанника по инвайт-коду
        public async Task<Student?> GetByAccessCodeAsync(string code)
        {
            return await _dbContext.Students
                .Include(s => s.Group)
                .Include(s => s.Parents)
                .FirstOrDefaultAsync(s => s.AccessCode == code);
        }

        //Получить список всех детей по Id родителя
        public async Task<List<Student>> GetChildrenAsync(Guid userId)
        {
            return await _dbContext.Students
                .AsNoTracking()
                .Where(s => s.IsActive && s.Parents.Any(p => p.Id == userId))
                .Include(s => s.Group)
                .ToListAsync();
        }

        // Получить спортсменов с фильтрацией, сортировкой, пагинацией и поиском
        public async Task<(List<StudentResponse> students, int TotalCount)> FindStudentsAsync(FindStudentRequest request)
        {
            var page = request.Page <= 0 ? 1 : request.Page;
            var pageSize = request.PageSize <= 0 ? 10 : request.PageSize;

            var query = from student in _dbContext.Students
                        join groupEntity in _dbContext.Groups on student.GroupId equals groupEntity.Id
                        join coach in _dbContext.Users on groupEntity.CoachId equals coach.Id
                        select new { student, groupEntity, coach };

            // Поиск
            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var pattern = $"%{request.Search.Trim()}%";
                query = query.Where(s =>
                    EF.Functions.ILike(s.student.LastName ?? "", pattern) ||
                    EF.Functions.ILike(s.student.FirstName ?? "", pattern) ||
                    EF.Functions.ILike(s.student.Patronymic ?? "", pattern)
                );
            }

            // Фильтр (Активные / Архив / По конкретной группе)
            var filterValue = request.Filter?.Trim().ToLower() ?? "active";

            if (filterValue == "deleted")
            {
                query = query.Where(s => !s.student.IsActive);
            }
            else if (filterValue.StartsWith("group_"))
            {
                var groupIdString = request.Filter!.Substring(6);
                if (Guid.TryParse(groupIdString, out var groupGuid))
                {
                    query = query.Where(s => s.student.IsActive && s.student.GroupId == groupGuid);
                }
            }
            else
            {
                query = query.Where(s => s.student.IsActive);
            }

            // Сортировка
            query = request.SortId?.ToLower() switch
            {
                "name" => request.IsDescending == true
                    ? query.OrderByDescending(x => x.student.LastName).ThenByDescending(x => x.student.FirstName)
                    : query.OrderBy(x => x.student.LastName).ThenBy(x => x.student.FirstName),

                "group" => request.IsDescending == true
                    ? query.OrderByDescending(x => x.groupEntity.Name)
                    : query.OrderBy(x => x.groupEntity.Name),

                // Сортировка по возрасту (дате рождения)
                "age" => request.IsDescending == true
                    ? query.OrderByDescending(x => x.student.BirthDate)
                    : query.OrderBy(x => x.student.BirthDate),

                _ => query.OrderBy(x => x.student.LastName)
            };

            var totalCount = await query.CountAsync();

            // Пагинация и маппинг в StudentResponse
            var students = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(s => new StudentResponse
                (
                    s.student.Id,
                    s.student.FirstName,
                    s.student.LastName,
                    s.student.Patronymic ?? "",
                    s.student.BirthDate,
                    s.student.Amplua.ToString(),
                    s.student.AccessCode ?? "",
                    s.groupEntity.Id,
                    s.groupEntity.Name,
                    s.student.IsActive
                ))
                .ToListAsync();

            return (students, totalCount);
        }

        //Сохранение любых изменений, также мягкое удаление
        public async Task UpdateAsync(Student student)
        {
            _dbContext.Students.Update(student);
            await _dbContext.SaveChangesAsync();
        }

        //Получить список всех "активных" учеников
        public async Task<List<Student>> GetAllActiveAsync()
        {
            return await _dbContext.Students.Include(s => s.Group).Where(s => s.IsActive == true).ToListAsync();
        }

        //Получить список воспитанников по группе
        public async Task<List<Student>> GetStudentsByGroupIdAsync(Guid groupId)
        {
            return await _dbContext.Students
                .AsNoTracking()
                .Where(s => s.IsActive == true && s.GroupId == groupId)
                .Include(s => s.Group)
                .ToListAsync();
        }

        //Восстановить студента
        public async Task RestoreStudentAsync(Guid id)
        {
            var student = await _dbContext.Students.FirstOrDefaultAsync(s => s.Id == id);
            if (student != null)
            {
                student.IsActive = true;
                _dbContext.Students.Update(student);
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
