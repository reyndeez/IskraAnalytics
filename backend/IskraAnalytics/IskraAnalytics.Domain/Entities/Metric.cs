using IskraAnalytics.Domain.Enums;

namespace IskraAnalytics.Domain.Entities
{
    public class Metric
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Recommendation { get; set; }
        public Units Unit { get; set; }
        public bool IsAscending { get; set; }
        public bool IsActive { get; set; } = true;

    }
}
