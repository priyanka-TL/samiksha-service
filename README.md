# samiksha-service

# Setup Guide

## Pre-Requisite

- Install any IDE in your system(eg: VScode etc..)
- Install nodejs from : https://nodejs.org/en/download/
- Install mongoDB: https://docs.mongodb.com/manual/installation/
- Install Robo 3T: ​​https://robomongo.org/

Basic understanding of git and github is recommended.

- https://www.youtube.com/watch?v=RGOj5yH7evk&t=2s
- https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F

## Setup samiksha-services

### Clone the service repository onto your system

- Create a new folder where you want to clone the repository.
- Navigate to that directory using the terminal.
- Execute the git commands to clone the repository using the provided link from the code tab.

Git link

    https://github.com/ELEVATE-Project/samiksha-service.git

command to clone

    git clone https://github.com/ELEVATE-Project/samiksha-service.git

### Create .env file

Create a file named `.env` and copy the environment-specific data corresponding to that service into the `.env` file.

# ML Survey Service Config

    # Service Config

    HOST = localhost
    PORT = 4301
    LOG = debug
    NODE_ENV = 'local'

    # Setting to turn on/off debug

    ENABLE_DEBUG_LOGGING = "OFF"

    # Setting to turn on/off bunyan logger service

    ENABLE_BUNYAN_LOGGING = "OFF"

    # Setting for custom request timeout for reports

    REQUEST_TIMEOUT_FOR_REPORTS = 600000
    APPLICATION_BASE_URL = "/assessment/"
    MOBILE_APPLICATION_APP_TYPE = "assessment"
    APPLICATION_BASE_HOST = "http://localhost"
    SHIKSHALOKAM_USER_PROFILE_FETCH_ENDPOINT = "/api/user/v1/read"
    AUTHORIZATION = "Server authorization code"
    #Cloud Storage Configuration
    CLOUD_STORAGE = "GC"

    # Google Cloud Configuration

    GCP_PATH = "./generics/helpers/credentials/sl-dev-storage.json"
    GCP_BUCKET_NAME = "gcp bucket name"
    MONGODB_URL = mongodb://localhost:27017
    SHIKSHALOKAM_BASE_HOST = "http://localhost"
    DB = "Samiksha5"

    # For reports generation.

    INTERNAL_ACCESS_TOKEN = "8c3a94f0931e01a4940a"

    # Auth Config

    sunbird_keycloak_auth_server_url="https://dev.shikshalokam.org/auth"
    sunbird_keycloak_realm="sunbird"
    sunbird_keycloak_client_id="portal"
    sunbird_keycloak_public=true
    sunbird_cache_store="memory"
    sunbird_cache_ttl=1800

    # Setting for migrations

    MIGRATION_COLLECTION = "migrations"
    MIGRATION_DIR = "migrations"

    # Slack Configuration

    SLACK_COMMUNICATIONS_ON_OFF = "OFF"
    SLACK_EXCEPTION_LOG_URL = ""
    SLACK_TOKEN = ""
    RUBRIC_ERROR_MESSAGES_TO_SLACK = "OFF"

    # CSV Config

    # Create the respective directory as provided in the path below.

    CSV_REPORTS_PATH = "reports"

    # Disable token check

    DISABLE_TOKEN_CHECK_ON_OFF = "OFF"
    DISABLE_TOKEN_CHECK_FOR_API = "endpoint1,endpoint2"
    DISABLE_TOKEN_endpoint1_USERS = "comma-seperated-userIds-for-multiple-values"
    DISABLE_TOKEN_endpoint2_USERS = "comma-seperated-userIds-for-multiple-values"
    DISABLE_TOKEN_DEFAULT_USERID = "DISABLE_TOKEN_CHECK_DEFAULT_USERID"
    DISABLE_TOKEN_DEFAULT_USER_ROLE = "ASSESSOR"
    DISABLE_TOKEN_DEFAULT_USER_NAME = "DISABLE_TOKEN_CHECK_DEFAULT_USER_NAME"
    DISABLE_TOKEN_DEFAULT_USER_EMAIL = "DISABLE_TOKEN_CHECK_DEFAULT_USER_EMAIL"

    # Disable learner service check

    DISABLE_LEARNER_SERVICE_ON_OFF = "OFF"

    # Kafka Configuration

    KAFKA_COMMUNICATIONS_ON_OFF = "OFF"
    KAFKA_URL = "100.0.0.1:9092"
    COMPLETED_SUBMISSION_TOPIC = "OFF"
    INCOMPLETE_SUBMISSION_TOPIC = "OFF"
    SUBMISSION_RATING_QUEUE_TOPIC = "OFF"
    NOTIFICATIONS_TOPIC = "OFF"
    COMPLETED_SURVEY_SUBMISSION_TOPIC = "OFF"
    INCOMPLETE_SURVEY_SUBMISSION_TOPIC= "OFF"
    KAFKA_ERROR_MESSAGES_TO_SLACK = "OFF"
    KAFKA_GROUP_ID = ""
    OBSERVATION_SUBMISSION_TOPIC = "OFF"

    # Email Configuration

    EMAIL_COMMUNICATIONS_ON_OFF = "OFF"
    EMAIL_SERVICE_BASE_URL = ""
    EMAIL_SERVICE_TOKEN = ""
    SUBMISSION_RATING_DEFAULT_EMAIL_RECIPIENTS = ""
    DEFAULT_USER_ID = ""

    # Default User Organisations - Used for migrations only

    USER_DEFAULT_ROOT_ORGANISATION = "0125747659358699520"
    USER_DEFAULT_ORGANISATION = "0125747659358699520,0126189555108741123"

    # CASSANDRA DATABASE CONFIGURATION

    CASSANDRA_HOST = "cassandra"
    CASSANDRA_PORT = "9042"
    CASSANDRA_DB = "store"

    # Elastic search configurations

    ELASTICSEARCH_COMMUNICATIONS_ON_OFF = "OFF"
    ELASTICSEARCH_HOST_URL = ""
    ELASTIC_SEARCH_REQUEST_TIMEOUT = ""
    ELASTIC_SEARCH_MAX_RETRIES = ""
    ELASTIC_SEARCH_SNIFF_ON_START = ""
    ELASTICSEARCH_USER_EXTENSION_INDEX = ""

    # KENDRA SERVICE

    KENDRA_APPLICATION_ENDPOINT = ""
    KENDRA_BASE_URL = ""
    ELASTICSEARCH_ENTITIES_INDEX = ""
    PUBLIC_FOLDER_PATH = "public"
    APP_PORTAL_BASE_URL = ""

    # OFFLINE TOKEN VALIDATION

    VALIDATE_ACCESS_TOKEN_OFFLINE = "ON"
    KEYCLOAK_PUBLIC_KEY_PATH = "keycloak-public-keys"

    # PUSH SUBMISSION IN IMPROVEMENT SERVICE

    IMPROVEMENT_PROJECT_SUBMISSION_TOPIC = ""
    URL_PREFIX = "api/v1"
    USE_USER_ORGANISATION_ID_FILTER = ""

    # IMPROVEMENT PROJECT SERVICE

    IMPROVEMENT_PROJECT_HOST = "http://localhost:4302"
    IMPROVEMENT_PROJECT_BASE_URL = "/improvement-project/"
    ACCESS_TOKEN_SECRET = "bsj82AHBxahusub12yexlashsbxAXADHBlaj"

### Install Dependencies

To install dependencies from a `package.json` file in Visual Studio Code, you can use the integrated terminal. Here are the steps:

- Open the integrated terminal by going to View > Terminal or using the shortcut Ctrl+` (backtick).
- In the terminal, navigate to the directory where the package.json file is located.
- Run the command `npm install` or `yarn install`, depending on your preferred package manager.
- The package manager will read the package.json file and install all the dependencies specified in it.
- Wait for the installation process to complete. You should see progress indicators or a success message for each installed dependency.
- Once the installation is finished, the dependencies listed in the package.json file will be installed in a node_modules directory in your project.

### Postman Collection

[Click here](https://documenter.getpostman.com/view/7997930/2s9Y5ZwMpH)

## IMPORTANT:

Always work on branches. **Never make changes to master**.

Creating a branch from master.

For more information on git you can use :  
 https://education.github.com/git-cheat-sheet-education.pdf
