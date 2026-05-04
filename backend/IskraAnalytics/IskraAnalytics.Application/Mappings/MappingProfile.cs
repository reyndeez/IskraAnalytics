using AutoMapper;
using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace IskraAnalytics.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //Пользователи
            CreateMap<User, CoachShortResponse>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.LastName} {src.FirstName} {src.Patronymic}".Trim()));
            CreateMap<RegisterRequest, User>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));
            CreateMap<LoginRequest, User>();

            //Роли
            CreateMap<IdentityRole<Guid>, RoleResponse>();

            //Воспитанники
            CreateMap<Student, StudentShortResponse>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.LastName} {src.FirstName} {src.Patronymic}".Trim()));
            CreateMap<Student, StudentResponse>()
                .ForMember(dest => dest.GroupName, opt => opt.MapFrom(src => src.Group.Name));
            CreateMap<CreateStudentRequest, Student>();
            CreateMap<UpdateGroupRequest, Student>();

            //Группы
            CreateMap<Group, GroupResponse>()
                .ForMember(dest => dest.CoachLastName, opt => opt.MapFrom(src => src.Coach.LastName))
                .ForMember(dest => dest.CoachFirstName, opt => opt.MapFrom(src => src.Coach.FirstName))
                .ForMember(dest => dest.CoachPatronymic, opt => opt.MapFrom(src => src.Coach.Patronymic));
            CreateMap<CreateGroupRequest, Group>();
            CreateMap<UpdateGroupRequest,  Group>();

            //Упражнения (метрики)
            CreateMap<Metric, MetricResponse>();
            CreateMap<CreateMetricRequest, Metric>();
            CreateMap<UpdateMetricRequest, Metric>();

            //Результы
            CreateMap<Result, ResultResponse>()
                .ConstructUsing(src => new ResultResponse(
                    src.Id,
                    src.Value,
                    src.CreatedAt.ToString("D"),
                    null!,
                    null!,
                    null!
                ))
                .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.Student))
                .ForMember(dest => dest.Coach, opt => opt.MapFrom(src => src.Coach))
                .ForMember(dest => dest.Metric, opt => opt.MapFrom(src => src.Metric));
            CreateMap<CreateResultRequest, Result>();
            CreateMap<UpdateResultRequest, Result>();
        }
    }
}
