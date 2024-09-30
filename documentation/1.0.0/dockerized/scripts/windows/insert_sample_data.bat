@echo off
setlocal enabledelayedexpansion

:: Ensure the correct number of arguments are provided
if "%~2"=="" (
    echo Error: Folder name and database URL not provided. Usage: %0 &lt;folder_name&gt; &lt;database_url&gt;
    exit /b 1
)

:: Use the provided folder name
set "FOLDER_NAME=sample-data\%~1"

:: Check if folder exists
if not exist "%FOLDER_NAME%" (
    echo Error: Folder '%FOLDER_NAME%' not found.
    exit /b 1
)

:: Use the provided database URL
set "DEV_DATABASE_URL=%~2"

set "conn=%DEV_DATABASE_URL%"

set "conn=!conn:postgres://=!"

for /f "tokens=1 delims=:" %%a in ("!conn!") do set "DB_USER=%%a"

set "conn=!conn:%DB_USER%:=!"

for /f "tokens=1 delims=@" %%a in ("!conn!") do set "DB_PASSWORD=%%a"

set "conn=!conn:%DB_PASSWORD%@=!"

set "hostport=!conn:*@=!"
for /f "tokens=1 delims=:" %%a in ("!hostport!") do set "DB_HOST=%%a"

set "conn=!conn:%DB_HOST%:=!"

for /f "tokens=1 delims=/" %%a in ("!conn!") do set "DB_PORT=%%a"

set "conn=!conn:*%DB_PORT%/=!"

set "DB_NAME=!conn!"

echo DB_USER: %DB_USER%
echo DB_PASSWORD: %DB_PASSWORD%
echo DB_HOST: %DB_HOST%
echo DB_PORT: %DB_PORT%
echo DB_NAME: %DB_NAME%

:: Define the container name (same as DB_HOST)
set "CONTAINER_NAME=%DB_HOST%"

:: Wait for Docker container to be up
echo Waiting for Docker container '%CONTAINER_NAME%' to be up...
:WAIT_CONTAINER
docker inspect "%CONTAINER_NAME%" >nul 2>&1
if errorlevel 1 (
    echo Waiting for container...
    timeout /t 1 /nobreak
    goto WAIT_CONTAINER
)
echo Container is now up.

:: Wait for PostgreSQL to be ready to accept connections
echo Waiting for PostgreSQL on '%DB_HOST%:%DB_PORT%' to accept connections...
:WAIT_DB
docker exec "%CONTAINER_NAME%" bash -c "pg_isready -h localhost -p %DB_PORT% -U %DB_USER%" >nul 2>&1
if errorlevel 1 (
    echo Waiting for database to be ready...
    timeout /t 1 /nobreak
    goto WAIT_DB
)
echo Database is ready.

:: Check if the database exists
:CHECK_DB
docker exec "%CONTAINER_NAME%" bash -c "PGPASSWORD='%DB_PASSWORD%' psql -h localhost -U %DB_USER% -p %DB_PORT% -lqt | cut -d \| -f 1 | grep -qw '%DB_NAME%'" >nul 2>&1
if errorlevel 1 (
    echo Database '%DB_NAME%' does not exist, waiting...
    timeout /t 5 /nobreak
    goto CHECK_DB
)
echo Database '%DB_NAME%' exists, proceeding with script.

:: Retrieve and prepare SQL file operations
set "SAMPLE_COLUMNS_FILE=%FOLDER_NAME%\sampleData.sql"
if not exist "%SAMPLE_COLUMNS_FILE%" (
    echo Error: sampleData.sql not found in folder '%FOLDER_NAME%'.
    exit /b 1
)

:: Copy the SQL file into the Docker container
echo Copying sampleData.sql to container '%CONTAINER_NAME%'...
docker cp "%SAMPLE_COLUMNS_FILE%" "%CONTAINER_NAME%:/sampleData.sql"

:: Execute the SQL file inside the container
echo Executing sampleData.sql in the database...
docker exec "%CONTAINER_NAME%" bash -c "PGPASSWORD='%DB_PASSWORD%' psql -h localhost -U %DB_USER% -d %DB_NAME% -p %DB_PORT% -f /sampleData.sql"
if errorlevel 1 (
    echo Error executing SQL script.
    exit /b 1
) else (
    echo SQL script executed successfully.
)

echo Sample Data Insertion Completed

endlocal