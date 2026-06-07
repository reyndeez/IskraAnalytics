using AutoMapper;
using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Domain.Interfaces;

namespace IskraAnalytics.Application.Services
{
    public class MetricService : IMetricService
    {
        readonly IMetricRepository _metricRepository;
        readonly IMapper _mapper;
        public MetricService(IMetricRepository metricRepository, IMapper mapper)
        {
            _metricRepository = metricRepository;
            _mapper = mapper;
        }

        //Найти метрики
        public async Task<MetricPagedResponse> FindMetricsAsync(FindMetricRequest request)
        {
            var (metrics, totalCount) = await _metricRepository.FindMetricsAsync(request);
            var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

            return new MetricPagedResponse(
                Metrics: metrics,
                TotalCount: totalCount,
                TotalPages: totalPages,
                CurrentPage: request.Page
            );
        }

        //Получить метрику по id
        public async Task<MetricResponse> GetMetricByIdAsync(Guid id)
        {
            var metric = await _metricRepository.GetMetricByIdAsync(id);
            return _mapper.Map<MetricResponse>(metric);
        }

        //Получить все "активные" метрики
        public async Task<List<MetricResponse>> GetAllActiveMetricsAsync()
        {
            var metric = await _metricRepository.GetAllActiveMetricsAsync();
            return _mapper.Map<List<MetricResponse>>(metric);
        }

        //Получить все метрики для селектора
        public async Task<List<MetricSelectorResponse>> GetMetricsForSelectorAsync()
        {
            var metrics = await _metricRepository.GetAllActiveMetricsAsync();
            return _mapper.Map<List<MetricSelectorResponse>>(metrics);
        }

        //Получить все метрики
        public async Task<List<MetricResponse>> GetAllMetricsAsync()
        {
            var metric = await _metricRepository.GetAllMetricsAsync();
            return _mapper.Map<List<MetricResponse>>(metric);
        }

        //Удалить метрику
        public async Task SoftDeleteMetricAsync(Guid id)
        {
            var metric = await _metricRepository.GetMetricByIdAsync(id);

            if (metric == null)
            {
                throw new Exception("Метрикки с выбранным id не существует");
            }
            else
            {
                metric.IsActive = false;
                await _metricRepository.UpdateAsync(metric);
            }
        }

        //Изменить метрику
        public async Task<MetricResponse> UpdateMetricAsync(Guid id, UpdateMetricRequest request)
        {
            var metric = await _metricRepository.GetMetricByIdAsync(id);

            if (metric == null)
            {
                throw new Exception("Метрикки с таким id не существует");
            }
            else
            {
                metric = _mapper.Map(request, metric);
                await _metricRepository.UpdateAsync(metric);
                return _mapper.Map<MetricResponse>(metric);
            }
        }

        //Создать метрику
        public async Task<MetricResponse> CreateMetricAsync(CreateMetricRequest request)
        {
            var metric = _mapper.Map<Metric>(request);
            metric.Id = Guid.NewGuid();
            await _metricRepository.CreateMetricAsync(metric);
            return _mapper.Map<MetricResponse>(metric);
        }
        
        //Восстановить метрику
        public async Task RestoreMetricAsync(Guid id)
        {
            await _metricRepository.RestoreMetricAsync(id);
        }
    }
}
