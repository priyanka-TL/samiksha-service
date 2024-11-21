@echo off
setlocal

REM Set the PostgreSQL password for user "postgres"
set PGPASSWORD=postgres

echo Starting database setup...

echo Creating PostgreSQL user...
psql -p 5432 -U postgres -c "CREATE USER postgres WITH ENCRYPTED PASSWORD 'postgres';"
if errorlevel 1 (
    echo Failed to create PostgreSQL user.
) else (
    echo PostgreSQL user created successfully.
)


echo Creating the users database...
psql -p 5432 -U postgres -c "CREATE DATABASE users;"
if errorlevel 1 (
    echo Failed to create users database.
) else (
    echo Users database created successfully.
)

echo Assigning privileges to users database...
psql -p 5432 -U postgres -d users -c "GRANT ALL PRIVILEGES ON DATABASE users TO postgres;"
psql -p 5432 -U postgres -d users -c "GRANT ALL ON SCHEMA public TO postgres;"
if errorlevel 1 (
    echo Failed to assign privileges to users database.
) else (
    echo Privileges assigned to users database successfully.
)

echo Creating the notification database...
psql -p 5432 -U postgres -c "CREATE DATABASE notification;"
if errorlevel 1 (
    echo Failed to create notification database.
) else (
    echo Notification database created successfully.
)

echo Assigning privileges to notification database...
psql -p 5432 -U postgres -d notification -c "GRANT ALL PRIVILEGES ON DATABASE notification TO postgres;"
psql -p 5432 -U postgres -d notification -c "GRANT ALL ON SCHEMA public TO postgres;"
if errorlevel 1 (
    echo Failed to assign privileges to notification database.
) else (
    echo Privileges assigned to notification database successfully.
)

echo Database setup complete.

REM Unset the environment variable for security
set PGPASSWORD=

endlocal
pause