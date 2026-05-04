using AutoMapper;
using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Domain.Enums;
using IskraAnalytics.Domain.Interfaces;

namespace IskraAnalytics.Application.Services
{
    public class AnalyticService : IAnalyticService
    {
        readonly IStudentRepository _studentRepository;
        readonly IMapper _mapper;
        readonly IGroupRepository _groupRepository;
        readonly IResultRepository _resultRepository;
        readonly IMetricRepository _metricRepository;
        public AnalyticService(IStudentRepository studentRepository, IMapper mapper, IGroupRepository groupRepository, IResultRepository resultRepository, IMetricRepository metricRepository)
        {
            _studentRepository = studentRepository;
            _mapper = mapper;
            _groupRepository = groupRepository;
            _resultRepository = resultRepository;
            _metricRepository = metricRepository;
        }

        //Получить рейтинг
        public async Task<List<LeaderBoardResponse>> GetRatingAsync(Guid metricId, Guid studentId)
        {
            var group = await _groupRepository.GetGroupByStudentId(studentId);
            if (group == null) throw new Exception("У этого студента нет группы");

            var metric = await _metricRepository.GetMetricByIdAsync(metricId);
            if (metric == null) throw new Exception("Метрика не найдена");

            var results = await _resultRepository.GetResultsByGroupAndMetric(group.Id, metricId);

            if (!results.Any()) return new List<LeaderBoardResponse>();

            var leaderboardData = results
                .GroupBy(r => r.StudentId)
                .Select(g => new
                {
                    Id = g.Key,
                    BestValue = metric.IsAscending ? g.Min(r => r.Value) : g.Max(r => r.Value),
                    Student = g.First().Student,
                    CreatedAt = g.First().CreatedAt,
                });

            var orderedData = metric.IsAscending
                ? leaderboardData.OrderBy(x => x.BestValue).ToList()
                : leaderboardData.OrderByDescending(x => x.BestValue).ToList();

            var response = orderedData.Select((item, index) => new LeaderBoardResponse(
                Rank: index + 1,
                StudentId: item.Id,
                StudentName: item.Id == studentId
                    ? $"{item.Student.LastName} {item.Student.FirstName}"
                    : $"Спортсмен #{item.Id.ToString().Substring(0, 4)}",
                Score: item.BestValue,
                Unit: metric.Unit.ToString(),
                CreatedAt: item.CreatedAt.ToString("d"),
                IsSelectedChild: item.Id == studentId
            )).ToList();

            return response;
        }

        //Получить данные для графика
        public async Task<List<ChartDataResponse>> GetChartDataAsync(ChartDataRequest request)
        {
            var studentResults = await _resultRepository.GetResultsByStudentAndMetric(request.StudentId, request.MetricId);
            
            if(studentResults.Count < 3) throw new Exception("Для отображения статистики должно быть минимум 3 записи результатов");

            var avg = studentResults.Average(sr => sr.Value);

            return studentResults
                .OrderBy(sr => sr.CreatedAt)
                .Select(sr => new ChartDataResponse(
                    CreatedAt: sr.CreatedAt.ToString("dd MMM"),
                    Value: sr.Value,
                    AvgValue: (double)Math.Round(avg, 2)
                    )).ToList();

        }

        private class RatingHelper
        {
            public Guid Id { get; set; }
            public string FullName { get; set; } = string.Empty;
            public double TotalScore { get; set; }
            public int FinishedMetrics { get; set; }
        }

        //Получить общий рейтинг
        public async Task<List<RatingOverallResponse>> GetRatingOverall(Guid studentId)
        {
            var group = await _groupRepository.GetGroupByStudentId(studentId);
            if (group == null) throw new Exception("У этого студента нет группы");

            var metrics = await _metricRepository.GetAllActiveMetricsAsync();
            var students = await _studentRepository.GetStudentsByGroupIdAsync(group.Id);


            var studentStats = students.Select(s => new {
                Id = s.Id,
                FullName = $"{s.LastName} {s.FirstName}",
                TotalScore = 0.0,
                FinishedMetrics = 0
            }).ToList();

            var ratingDraft = studentStats.Select(s => new RatingHelper
            {
                Id = s.Id,
                FullName = s.FullName
            }).ToList();

            foreach (var metric in metrics)
            {
                var values = await _resultRepository.GetResultsByGroupAndMetric(group.Id, metric.Id);
                if (!values.Any()) continue;

                var bestValues = values
                    .GroupBy(r => r.StudentId)
                    .Select(g => new {
                        StudentId = g.Key,
                        BestValue = metric.IsAscending ? g.Min(r => r.Value) : g.Max(r => r.Value)
                    })
                    .OrderBy(bv => metric.IsAscending ? bv.BestValue : -bv.BestValue)
                    .ToList();

                for (int i = 0; i < bestValues.Count; i++)
                {
                    var studentIdInMetric = bestValues[i].StudentId;
                    var studentInRating = ratingDraft.FirstOrDefault(s => s.Id == studentIdInMetric);

                    if (studentInRating != null)
                    {
                        double coeff = (double)(bestValues.Count - i) / bestValues.Count;

                        studentInRating.TotalScore += coeff;
                        studentInRating.FinishedMetrics++;
                    }
                }
            }

            var sortedList = ratingDraft
                .Where(s => s.FinishedMetrics > 0)
                .Select(s => new {
                    Id = s.Id,
                    Name = s.FullName,
                    AvgScore = Math.Round((s.TotalScore / s.FinishedMetrics) * 100, 1),
                })
                .OrderByDescending(r => r.AvgScore)
                .ToList();
            var response = sortedList.Select((item, index) => new RatingOverallResponse(
                Rank: index + 1,               
                StudentId: item.Id,
                StudentName: item.Name,
                Score: item.AvgScore,
                Unit: Units.Points.ToString(),
                IsSelectedChild: item.Id == studentId
            )).ToList();

            return response;
        }

        //Получить слабые места для рекомендаций
        public async Task<List<RecommendationResponse>> GetRecommendations(RecommendationRequest request)
        {
            var group = await _groupRepository.GetGroupByStudentId(request.StudentId);
            if (group == null) throw new Exception("У этого студента нет группы");
            var metrics = await _metricRepository.GetAllActiveMetricsAsync();

            var analysisResults = new List<(Metric Metric, double Coefficient, int Rank)>();

            foreach (var metric in metrics)
            {
                var values = await _resultRepository.GetResultsByGroupAndMetric(group.Id, metric.Id);
                var bestValues = values
                    .GroupBy(r => r.StudentId)
                    .Select(g => new
                    {
                        BestValue = metric.IsAscending ? g.Min(r => r.Value) : g.Max(r => r.Value),
                        StudentId = g.First().StudentId
                    }
                    );
                var orderedBestValues = metric.IsAscending ?
                    bestValues.OrderBy(bv => bv.BestValue).ToList() :
                    bestValues.OrderByDescending(bv => bv.BestValue).ToList();
                if (orderedBestValues.Count == 0) continue;

                int index = orderedBestValues.FindIndex(obv => obv.StudentId == request.StudentId);

                if (index == -1) continue;

                var coefficient = (double)(orderedBestValues.Count - (index + 1)) / orderedBestValues.Count;

                analysisResults.Add(new(metric, coefficient, index + 1));
            }
            var weakest = analysisResults.OrderBy(ar => ar.Coefficient).Take(3);

            var response = weakest.Select(w => new RecommendationResponse(
                Name: w.Metric.Name,
                Description: w.Metric.Description,
                Recommendation: w.Metric.Recommendation,
                Unit: w.Metric.Unit.ToString()
                )).ToList();

            return response;
        }
    }
}
