using AutoMapper;
using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Domain.Interfaces;

namespace IskraAnalytics.Application.Services
{
    public class StudentService : IStudentService
    {
        readonly IStudentRepository _studentRepository;
        readonly IGroupRepository _groupRepository;
        readonly IUserRepository _userRepository;
        readonly IMapper _mapper;
        public StudentService(IStudentRepository studentRepository, IMapper mapper, IGroupRepository groupRepository, IUserRepository userRepository)
        {
            _studentRepository = studentRepository;
            _mapper = mapper;
            _groupRepository = groupRepository;
            _userRepository = userRepository;
        }

        //Найти воспитанников
        public async Task<StudentPagedResponse> FindStudentsAsync(FindStudentRequest request)
        {
            var (students, totalCount) = await _studentRepository.FindStudentsAsync(request);
            var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

            return new StudentPagedResponse(
                Students: students,
                TotalCount: totalCount,
                TotalPages: totalPages,
                CurrentPage: request.Page
            );
        }

        //Создать воспитанника
        public async Task<StudentResponse> CreateStudentAsync(CreateStudentRequest request)
        {
            var group = await _groupRepository.GetByIdAsync(request.GroupId);

            if (group == null)
            {
                throw new Exception("Такой группы не существует!");
            }
            else
            {
                var student = _mapper.Map<Student>(request);

                student.Id = Guid.NewGuid();
                student.AccessCode = Path.GetRandomFileName().ToString().ToUpper().Replace(".", "").Substring(0, 8);
                student.Group = group;


                await _studentRepository.CreateAsync(student);

                return _mapper.Map<StudentResponse>(student);
            }

        }

        //Удалить воспитанника
        public async Task SoftDeleteAsync(Guid studentId)
        {
            var student = await _studentRepository.GetStudentByIdAsync(studentId);
            if (student != null)
            {
                student.IsActive = false;
                await _studentRepository.UpdateAsync(student);
            }
            else
            {
                throw new Exception("Воспитанника с указанным id не существует");
            }            
        }

        //Получить список воспитанников по группе
        public async Task<List<StudentResponse>> GetStudentsByGroupAsync(Guid groupId)
        {
            var students = await _studentRepository.GetStudentsByGroupIdAsync(groupId);
            return _mapper.Map<List<StudentResponse>>(students).ToList();
        }

        //Получить список всех воспитанников 
        public async Task<List<StudentResponse>> GetAllStudentsAsync()
        {
            var students = await _studentRepository.GetAllActiveAsync();
            return _mapper.Map<List<StudentResponse>>(students).ToList();
        }

        //Получить список всех детей по Id родителя
        public async Task<List<StudentResponse>> GetChildrenAsync(Guid userId)
        {
            var students = await _studentRepository.GetChildrenAsync(userId);
            return _mapper.Map<List<StudentResponse>>(students).ToList();
        }

        //Получить воспитанника по id
        public async Task<StudentResponse> GetStudentByIdAsync(Guid studentId)
        {
            var student = await _studentRepository.GetStudentByIdAsync(studentId);

            if (student != null)
            {
                return _mapper.Map<StudentResponse>(student);
            }
            else
            {
                throw new Exception("Воспитанника с указанным id не существует");
            }
        }

        //Изменить данные воспитанника
        public async Task<StudentResponse> UpdateStudentAsync(Guid studentId, UpdateStudentRequest request)
        {
            var student = await _studentRepository.GetStudentByIdAsync(studentId);

            if (student != null)
            {
                student = _mapper.Map(request, student);
                await _studentRepository.UpdateAsync(student);

                return _mapper.Map<StudentResponse>(student);
            }
            else
            {
                throw new Exception("Воспитанника с указанным id не существует");
            }
        }

        //Связать ребенка с родителем
        public async Task BindChildWithParentAsync(string code, Guid userId)
        {
            var student = await _studentRepository.GetByAccessCodeAsync(code);
            if (student == null) throw new Exception("Неверный код доступа");

            if (student.Parents.Any(p => p.Id == userId)) throw new Exception("Этот воспитанник уже добавлен в ваш профиль");

            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null) throw new Exception("Пользователь не найден");

            student.Parents.Add(user);

            await _studentRepository.UpdateAsync(student);
        }

        //Восстановить студента
        public async Task RestoreStudentAsync(Guid id)
        {
            await _studentRepository.RestoreStudentAsync(id);
        }
    }
}
