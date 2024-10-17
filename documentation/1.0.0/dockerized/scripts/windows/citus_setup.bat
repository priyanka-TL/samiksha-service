@echo off

rem Exit on error
setlocal enabledelayedexpansion

if "%~2"=="" (
  echo Error: Folder name and database URL not provided. Usage: %0 ^<folder_name^> ^<database_url^>
  exit /b 1
)

rem Use the provided folder name
set "FOLDER_NAME=%~1"

rem Check if folder exists
if not exist "%FOLDER_NAME%\" (
  echo Error: Folder '%FOLDER_NAME%' not found.
  exit /b 1
)

rem Use the provided database URL
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

rem Path to the script directory
for %%I in ("%~dp0") do set "SCRIPT_DIR=%%~fI"

rem Path to distributionColumns.sql file
set "DISTRIBUTION_COLUMNS_FILE=%SCRIPT_DIR%\%FOLDER_NAME%\distributionColumns.sql"

if not exist "%DISTRIBUTION_COLUMNS_FILE%" (
  echo Error: distributionColumns.sql file not found in folder '%FOLDER_NAME%'.
  exit /b 1
)

rem Create Citus extension
echo Creating Citus extension in the database...
docker exec -i %DB_HOST% psql -U %DB_USER% -d %DB_NAME% -p %DB_PORT% -c "CREATE EXTENSION IF NOT EXISTS citus;"

rem Copy distributionColumns.sql file into the Docker container
echo Copying distributionColumns.sql file into the Docker container...
docker cp "%DISTRIBUTION_COLUMNS_FILE%" "%DB_HOST%:/tmp/distributionColumns.sql"

rem Run distributionColumns.sql in the Docker container
echo Creating distribution columns...
docker exec -i %DB_HOST% psql -U %DB_USER% -d %DB_NAME% -p %DB_PORT% -f "/tmp/distributionColumns.sql"

echo Citus extension setup complete.

pause