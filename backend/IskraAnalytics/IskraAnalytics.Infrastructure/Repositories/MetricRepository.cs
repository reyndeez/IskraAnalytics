using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Domain.Interfaces;
using IskraAnalytics.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IskraAnalytics.Infrastructure.Repositories
{
    public class MetricRepository : IMetricRepository
    {
        readonly IskraDbContext _dbContext;
        public MetricRepository(IskraDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //Получить метрику по её id
        public async Task<Metric?> GetMetricByIdAsync(Guid id)
        {
            return await _dbContext.Metrics.FirstOrDefaultAsync(m => m.Id == id);
        }

        //Получить список всех метрик
        public async Task<List<Metric>> GetAllMetricsAsync()
        {
            return await _dbContext.Metrics.ToListAsync();
        }

        //Получить список всех "активных" метрик
        public async Task<List<Metric>> GetAllActiveMetricsAsync()
        {
            return await _dbContext.Metrics.AsNoTracking().Where(m => m.IsActive).ToListAsync();
        }

        // Получить метрики с фильтрацией, сортировкой, пагинацией и поиском
        public async Task<(List<MetricResponse> metrics, int TotalCount)> FindMetricsAsync(FindMetricRequest request)
        {
            var page = request.Page <= 0 ? 1 : request.Page;
            var pageSize = request.PageSize <= 0 ? 10 : request.PageSize;

            var query = _dbContext.Metrics.AsQueryable();

            // Поиск
            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var pattern = $"%{request.Search.Trim()}%";
                query = query.Where(m =>
                    EF.Functions.ILike(m.Name ?? "", pattern) ||
                    EF.Functions.ILike(m.Description ?? "", pattern)
                );
            }

            // Фильтр
            var filterValue = request.Filter?.Trim().ToLower() ?? "active";

            if (filterValue == "deleted")
            {
                query = query.Where(m => !m.IsActive);
            }
            else
            {
                query = query.Where(m => m.IsActive);
            }

            // Сортировка
            query = request.SortId?.ToLower() switch
            {
                "name" => request.IsDescending == true
                    ? query.OrderByDescending(m => m.Name)
                    : query.OrderBy(m => m.Name),

                "unit" => request.IsDescending == true
                    ? query.OrderByDescending(m => m.Unit)
                    : query.OrderBy(m => m.Unit),

                _ => query.OrderBy(m => m.Name)
            };

            var totalCount = await query.CountAsync();

            // Пагинация и маппинг в MetricResponse
            var metrics = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new MetricResponse
                (
                    m.Id,
                    m.Name,
                    m.Description ?? "",
                    m.Recommendation ?? "",
                    m.Unit,
                    m.IsActive
                ))
                .ToListAsync();

            return (metrics, totalCount);
        }

        //Создание метрики
        public async Task CreateMetricAsync(Metric metric)
        {
            await _dbContext.Metrics.AddAsync(metric);
            await _dbContext.SaveChangesAsync();
        }

        //Сохранение любых изменений, мягкое удаление
        public async Task UpdateAsync(Metric metric)
        {
            _dbContext.Update(metric);
            await _dbContext.SaveChangesAsync();
        }

        // Восстановление метрики (перевод флага IsActive в true)
        public async Task RestoreMetricAsync(Guid id)
        {
            var metric = await _dbContext.Metrics.FirstOrDefaultAsync(m => m.Id == id);
            if (metric != null)
            {
                metric.IsActive = true;
                _dbContext.Metrics.Update(metric);
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
