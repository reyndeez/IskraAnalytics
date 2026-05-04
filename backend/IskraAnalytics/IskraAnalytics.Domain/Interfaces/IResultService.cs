using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IResultService
    {
        Task<ResultResponse> CreateResult(CreateResultRequest request);
        Task DeleteResultAsync(Guid id);
        Task<ResultResponse> GetResultByIdAsync(Guid id);
        Task<ResultResponse> UpdateResultAsync(Guid id, UpdateResultRequest request);
        Task<List<ResultResponse>> GetAllResultsByStudentId(Guid studentId);
    }
}