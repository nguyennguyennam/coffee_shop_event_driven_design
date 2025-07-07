# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
WORKDIR /app

# ✅ Copy toàn bộ backend
COPY backend/ ./backend/

# ✅ Set working directory đúng nơi chứa .csproj
WORKDIR /app/backend

# ✅ Restore
RUN dotnet restore

# ✅ Publish
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "backend.dll"]
