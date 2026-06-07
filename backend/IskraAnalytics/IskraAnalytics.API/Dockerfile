FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Копируем файлы проектов по их точным путям
COPY ["backend/IskraAnalytics/IskraAnalytics.API/IskraAnalytics.API.csproj", "backend/IskraAnalytics/IskraAnalytics.API/"]
COPY ["backend/IskraAnalytics/IskraAnalytics.Application/IskraAnalytics.Application.csproj", "backend/IskraAnalytics/IskraAnalytics.Application/"]
COPY ["backend/IskraAnalytics/IskraAnalytics.Domain/IskraAnalytics.Domain.csproj", "backend/IskraAnalytics/IskraAnalytics.Domain/"]
COPY ["backend/IskraAnalytics/IskraAnalytics.Infrastructure/IskraAnalytics.Infrastructure.csproj", "backend/IskraAnalytics/IskraAnalytics.Infrastructure/"]

# Восстанавливаем зависимости
RUN dotnet restore "backend/IskraAnalytics/IskraAnalytics.API/IskraAnalytics.API.csproj"

# Копируем остальной исходный код
COPY . .

WORKDIR "/src/backend/IskraAnalytics/IskraAnalytics.API"
RUN dotnet build "IskraAnalytics.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "IskraAnalytics.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IskraAnalytics.API.dll"]