namespace IskraAnalytics.Domain.Entities
{
    public class Result
    {
        public Guid Id { get; set; }
        public double Value { get; set; }
        public DateTime CreatedAt { get; set; }

        public Guid StudentId { get; set; }
        public Student Student { get; set; } = null!;

        public Guid CoachId { get; set; }
        public User Coach { get; set; } = null!;

        public Guid MetricId { get; set; }
        public Metric Metric { get; set; } = null!;
    }
}
