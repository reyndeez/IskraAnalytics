namespace IskraAnalytics.Domain.Contracts.Requests
{
    public record FindUserRequest(
        string? Search = null, //Поиск
        string? RoleId = null, //Фильтр
        string? SortId = null, //Сортирвока
        bool? IsDescending = false, //По убыванию/По возрастанию
        int Page = 1, //Текущая страница
        int PageSize = 6 //Количество на странице
        );
}
