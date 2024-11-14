@echo off
setlocal enabledelayedexpansion

REM Check if MongoDB connection string is provided
if "%~1"=="" (
    echo Please provide the MongoDB connection string.
    exit /b 1
)
echo %~1
set MONGODB_URL=%~1
set ORGANIZATION_ID=%~2
if "%ORGANIZATION_ID%"=="" set ORGANIZATION_ID=1
REM
for /f "tokens=2 delims=/" %%a in ("%MONGODB_URL%") do (
    set "URL_PART=%%a"
)

for /f "tokens=1,2 delims=:" %%a in ("%URL_PART%") do (
    set "DB_HOST=%%a"
    set "DB_PORT=%%b"
)

for /f "tokens=3 delims=/" %%a in ("%MONGODB_URL%") do (
    set "DB_NAME=%%a"
)

echo Host: %DB_HOST%
echo Port: %DB_PORT%
echo Database: %DB_NAME%

echo Extracted Database Variables:
echo DB_HOST: !DB_HOST!
echo DB_PORT: !DB_PORT!
echo DB_NAME: !DB_NAME!
echo Using organizationId: !ORGANIZATION_ID!

REM Check if the MongoDB container is up
docker ps -q -f name=survey_mongo_1 >nul
if %errorlevel% neq 0 (
    echo MongoDB container is not running.
    exit /b 1
)

echo Waiting for MongoDB to be ready...
:wait_for_mongo
docker exec survey_mongo_1 mongo --host !DB_HOST! --port !DB_PORT! --eval "print(\"waited for connection\")" >nul 2>&1
if %errorlevel% neq 0 (
    timeout /t 1 >nul
    goto wait_for_mongo
)

echo MongoDB is ready.

REM Download the forms.json file
curl -o modifyform.js 
curl -o forms.json https://raw.githubusercontent.com/ELEVATE-Project/observation-survey-projects-pwa/refs/heads/release-2.0.0/forms.json

:: Modify forms.json to add organizationId, deleted, and version fields
echo Running Node.js script to modify forms.json...
node modifyform.js

:: Check if the modified file was created
if exist forms_with_orgId.json (
    echo forms_with_orgId.json created successfully.
) else (
    echo Failed to create forms_with_orgId.json.
    exit /b 1
)

REM Copy the modified JSON file into the MongoDB container
docker cp forms_with_orgId.json survey_mongo_1:/tmp/forms_with_orgId.json

REM Delete existing documents from the forms collection
echo Deleting existing documents from the forms collection...
docker exec survey_mongo_1 mongo --host !DB_HOST! --port !DB_PORT! !DB_NAME! --eval "db.forms.deleteMany({})"

REM Insert new documents from modified forms.json into MongoDB
echo Inserting new documents from modified forms.json into MongoDB...
docker exec survey_mongo_1 mongoimport --host !DB_HOST! --port !DB_PORT! --db !DB_NAME! --collection forms --file /tmp/forms_with_orgId.json --jsonArray

REM Creating configurations.json with the configuration data
echo Creating configurations.json file...
echo [{"_id": {"$oid": "672b091a95d8ba297ffe6911"}, "code": "keysAllowedForTargeting", "meta": {"profileKeys": ["state", "district", "school", "block", "cluster", "board", "class", "roles", "entities", "entityTypeId", "entityType", "subject", "medium"]}}] > configurations.json

REM Copy configurations.json into the MongoDB container
docker cp configurations.json survey_mongo_1:/tmp/configurations.json

REM Delete existing documents from the configurations collection
echo Deleting existing documents from the configurations collection...
docker exec survey_mongo_1 mongo --host !DB_HOST! --port !DB_PORT! !DB_NAME! --eval "db.configurations.deleteMany({})"

REM Insert new documents from configurations.json into MongoDB
echo Inserting new documents from configurations.json into MongoDB...
docker exec survey_mongo_1 mongoimport --host !DB_HOST! --port !DB_PORT! --db !DB_NAME! --collection configurations --file /tmp/configurations.json --jsonArray

REM Clean up
del forms.json
del forms_with_orgId.json
del configurations.json
docker exec survey_mongo_1 rm /tmp/forms_with_orgId.json
docker exec survey_mongo_1 rm /tmp/configurations.json

endlocal