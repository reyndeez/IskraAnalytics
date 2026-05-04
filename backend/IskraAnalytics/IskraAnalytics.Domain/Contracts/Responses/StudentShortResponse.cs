namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record StudentShortResponse(
        Guid Id,
        string FullName
        )
        {
        // Добавляем пустой конструктор, который вызывает основной с дефолтными значениями
        public StudentShortResponse() : this(Guid.Empty, string.Empty) { }
        }
}
