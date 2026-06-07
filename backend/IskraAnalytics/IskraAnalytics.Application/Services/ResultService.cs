using AutoMapper;
using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Domain.Interfaces;

namespace IskraAnalytics.Application.Services
{
    public class ResultService : IResultService
    {
        readonly IResultRepository _resultRepository;
        readonly IStudentRepository _studentRepository;
        readonly IGroupRepository _groupRepository;
        readonly IMetricRepository _metricRepository;
        readonly IMapper _mapper;
        public ResultService(IResultRepository resultRepository, IMapper mapper, IStudentRepository studentRepository, IGroupRepository groupRepository, IMetricRepository metricRepository)
        {
            _resultRepository = resultRepository;
            _mapper = mapper;
            _studentRepository = studentRepository;
            _groupRepository = groupRepository;
            _metricRepository = metricRepository;
        }

        //Получить результат по id
        public async Task<ResultResponse> GetResultByIdAsync(Guid id)
        {
            var result = await _resultRepository.GetResultByIdAsync(id);
            return _mapper.Map<ResultResponse>(result);
        }

        //Получить список результатов по id воспитанника
        public async Task<List<ResultResponse>> GetAllResultsByStudentId(Guid studentId)
        {
            var student = await _studentRepository.GetStudentByIdAsync(studentId);

            if(student == null)
            {
                throw new Exception("Воспитанника с таким id не существует");
            }
            else
            {
                var result = await _resultRepository.GetAllResultByStudentIdAsync(studentId);
                return _mapper.Map<List<ResultResponse>>(result);
            }
        }

        //Получить список результатов по метрике, группе и дате
        public async Task<List<MeasurementResponse>> GetResultsForMeasurementAsync(Guid groupId, Guid metricId, DateTime date)
        {
            var group = await _groupRepository.GetByIdAsync(groupId);
            var metric = await _metricRepository.GetMetricByIdAsync(metricId);

            if (metric == null || group == null)
            {
                throw new Exception("Метрика или группа с таким id не существует");
            }

            var results = await _resultRepository.GetResultsForMeasurementAsync(groupId, metricId, date, metric);

            return _mapper.Map<List<MeasurementResponse>>(results);
        }

        //Обновление значения результата
        public async Task<Guid> UpsertResultAsync(UpsertResultRequest request, Guid coachId)
        {
            var utcDate = DateTime.SpecifyKind(request.Date, DateTimeKind.Utc);

            return await _resultRepository.UpsertResultAsync(
                request.ResultId,
                request.StudentId,
                request.MetricId,
                utcDate,
                request.Value,
                coachId);
        }

        //Удалить результат
        public async Task DeleteResultAsync(Guid id)
        {
            var result = await _resultRepository.GetResultByIdAsync(id);

            if (result != null)
            {
                await _resultRepository.DeleteResultAsync(result);
            }
            else
            {
                throw new Exception("Результата с таким id не существует");
            }
        }

        //Изменить результат
        public async Task<ResultResponse> UpdateResultAsync(Guid id, UpdateResultRequest request)
        {
            var result = await _resultRepository.GetResultByIdAsync(id);

            if (result != null)
            {
                result = _mapper.Map(request, result);
                await _resultRepository.UpdateResultAsync(result);

                return _mapper.Map<ResultResponse>(result);
            }
            else
            {
                throw new Exception("Результата с таким id не существует");
            }
        }

        //Создать результат
        public async Task<ResultResponse> CreateResult(CreateResultRequest request)
        {
            var result = _mapper.Map<Result>(request);
            result.Id = Guid.NewGuid();
            await _resultRepository.CreateResultAsync(result);
            return _mapper.Map<ResultResponse>(result);
        }
    }
}
