FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# ВАЖНО: Копируем файлы проектов с учетом всей вложенности
COPY ["backend/IskraAnalytics/IskraAnalytics.API/IskraAnalytics.API.csproj", "backend/IskraAnalytics/IskraAnalytics.API/"]
COPY ["backend/IskraAnalytics/IskraAnalytics.Application/IskraAnalytics.Application.csproj", "backend/IskraAnalytics/IskraAnalytics.Application/"]
COPY ["backend/IskraAnalytics/IskraAnalytics.Domain/IskraAnalytics.Domain.csproj", "backend/IskraAnalytics/IskraAnalytics.Domain/"]
COPY ["backend/IskraAnalytics/IskraAnalytics.Infrastructure/IskraAnalytics.Infrastructure.csproj", "backend/IskraAnalytics/IskraAnalytics.Infrastructure/"]

# Восстанавливаем зависимости
RUN dotnet restore "backend/IskraAnalytics/IskraAnalytics.API/IskraAnalytics.API.csproj"

# Копируем всё остальное содержимое из корня
COPY . .

# Собираем
WORKDIR "/src/backend/IskraAnalytics/IskraAnalytics.API"
RUN dotnet build "IskraAnalytics.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "IskraAnalytics.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IskraAnalytics.API.dll"]