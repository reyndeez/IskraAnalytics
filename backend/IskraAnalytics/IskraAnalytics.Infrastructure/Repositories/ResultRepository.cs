using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Domain.Interfaces;
using IskraAnalytics.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace IskraAnalytics.Infrastructure.Repositories
{
    public class ResultRepository : IResultRepository
    {
        readonly IskraDbContext _dbContext;
        public ResultRepository(IskraDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //Получить результат по его id
        public async Task<Result?> GetResultByIdAsync(Guid id)
        {
            return await _dbContext.Results.Include(r => r.Student).Include(r => r.Metric).Include(r => r.Coach).FirstOrDefaultAsync(r => r.Id == id);
        }

        //Получить список всех результатов у воспитанника
        public async Task<List<Result>> GetAllResultByStudentIdAsync(Guid studentId)
        {
            return await _dbContext.Results.Include(r => r.Student).Include(r => r.Metric).Include(r => r.Coach).Where(r => r.StudentId == studentId).ToListAsync();
        }

        //Получить список всех результатов для группы по метрике
        public async Task<List<Result>> GetResultsByGroupAndMetric(Guid groupId,  Guid metricId)
        {
            return await _dbContext.Results
                .Include(r => r.Student)
                .Include(r => r.Metric)
                .Where(r => r.Student.GroupId == groupId && r.MetricId == metricId)
                .ToListAsync();
        }
        //Получить список всех результатов для воспитанника по метрике
        public async Task<List<Result>> GetResultsByStudentAndMetric(Guid studentId, Guid metricId)
        {
            return await _dbContext.Results
                .Include(r => r.Student)
                .Include(r => r.Metric)
                .Where(r => r.StudentId == studentId && r.MetricId == metricId)
                .ToListAsync();
        }

        //Получить список всех результатов для воспитанника по метрике, группе и дате
        public async Task<List<Result>> GetResultsForMeasurementAsync(Guid groupId, Guid metricId, DateTime date, Metric metric)
        {
            var query = from s in _dbContext.Students
                        where s.GroupId == groupId
                        join r in _dbContext.Results.Where(res => res.MetricId == metricId && res.CreatedAt.Date == date.Date)
                        on s.Id equals r.StudentId into studentResults
                        from subResult in studentResults.DefaultIfEmpty()
                        select new { s, subResult };

            var data = await query.ToListAsync();

            return data.Select(x => x.subResult ?? new Result
            {
                Student = x.s,
                StudentId = x.s.Id,
                Metric = metric,
                MetricId = metricId,
                Value = 0,
                CreatedAt = date
            }).ToList();
        }

        //Создание результата для воспитанника
        public async Task CreateResultAsync(Result result)
        {
            await _dbContext.Results.AddAsync(result);
            await _dbContext.SaveChangesAsync();
        }

        //Сохранение любых изменений
        public async Task UpdateResultAsync(Result result)
        {
            _dbContext.Results.Update(result);
            await _dbContext.SaveChangesAsync();
        }

        //Обновление значения результата
        public async Task<Guid> UpsertResultAsync(Guid? resultId, Guid studentId, Guid metricId, DateTime date, double value, Guid coachId)
        {
            Result? existingResult = null;

            if (resultId.HasValue && resultId.Value != Guid.Empty)
            {
                existingResult = await _dbContext.Results.FindAsync(resultId.Value);
            }

            if (existingResult == null)
            {
                existingResult = await _dbContext.Results
                    .FirstOrDefaultAsync(r => r.StudentId == studentId
                                          && r.MetricId == metricId
                                          && r.CreatedAt.Date == date.Date);
            }

            if (existingResult != null)
            {
                existingResult.Value = value;
            }
            else
            {
                if (value == 0) return Guid.Empty;

                existingResult = CreateNewResult(studentId, metricId, date, value, coachId);
                await _dbContext.Results.AddAsync(existingResult);
            }

            await _dbContext.SaveChangesAsync();
            return existingResult.Id;
        }

        //Удалить результат
        public async Task DeleteResultAsync(Result result)
        {
            _dbContext.Results.Remove(result);
            await _dbContext.SaveChangesAsync();
        }


        // Инициализация результата
        private Result CreateNewResult(Guid studentId, Guid metricId, DateTime date, double value, Guid coachId)
        {
            return new Result
            {
                Id = Guid.NewGuid(),
                StudentId = studentId,
                MetricId = metricId,
                CoachId = coachId,
                Value = value,
                CreatedAt = date
            };
        }
    }
}
