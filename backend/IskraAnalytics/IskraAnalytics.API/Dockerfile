FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Копируем проекты (пути теперь относительны корня ./backend/IskraAnalytics)
COPY ["IskraAnalytics.API/IskraAnalytics.API.csproj", "IskraAnalytics.API/"]
COPY ["IskraAnalytics.Application/IskraAnalytics.Application.csproj", "IskraAnalytics.Application/"]
COPY ["IskraAnalytics.Domain/IskraAnalytics.Domain.csproj", "IskraAnalytics.Domain/"]
COPY ["IskraAnalytics.Infrastructure/IskraAnalytics.Infrastructure.csproj", "IskraAnalytics.Infrastructure/"]

# Восстанавливаем
RUN dotnet restore "IskraAnalytics.API/IskraAnalytics.API.csproj"

# Копируем остальной код
COPY . .

# Собираем
RUN dotnet build "IskraAnalytics.API/IskraAnalytics.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "IskraAnalytics.API/IskraAnalytics.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IskraAnalytics.API.dll"]