FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
COPY . /src
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
COPY . /src
WORKDIR /src
RUN dotnet build "TilesApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TilesApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TilesApi.dll"]
