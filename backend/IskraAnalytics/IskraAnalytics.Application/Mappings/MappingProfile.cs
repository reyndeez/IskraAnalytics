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
            CreateMap<UpdateStudentRequest, Student>();            
            CreateMap<Student, StudentPagedResponse>();

            //Группы
            CreateMap<Group, GroupResponse>();
            //.ForMember(dest => dest.CoachLastName, opt => opt.MapFrom(src => src.Coach.LastName))
            //.ForMember(dest => dest.CoachFirstName, opt => opt.MapFrom(src => src.Coach.FirstName))
            //.ForMember(dest => dest.CoachPatronymic, opt => opt.MapFrom(src => src.Coach.Patronymic));
            CreateMap<Group, GroupAdminResponse>();
            CreateMap<Group, GroupPagedResponse>();
            CreateMap<CreateGroupRequest, Group>();
            CreateMap<UpdateGroupRequest,  Group>();
            CreateMap<Group, GroupWithStudentsResponse>()
                .ForMember(dest => dest.Students, opt => opt.MapFrom(src => src.Students));

            //Упражнения (метрики)
            CreateMap<Metric, MetricResponse>();
            CreateMap<CreateMetricRequest, Metric>();
            CreateMap<UpdateMetricRequest, Metric>();
            CreateMap<Metric, MetricPagedResponse>();
            CreateMap<Metric, MetricSelectorResponse>();

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
            CreateMap<Result, MeasurementResponse>()
                .ConstructUsing(src => new MeasurementResponse(
                    src.Id == Guid.Empty ? null : src.Id,
                    null!,
                    src.Value,
                    src.Metric.Unit.ToString()
                ))
                .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.Student))
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.Value))
                .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Metric.Unit.ToString()));
            CreateMap<CreateResultRequest, Result>();
            CreateMap<UpdateResultRequest, Result>();
        }
    }
}
