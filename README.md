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

    #Cloud Storage Configuration
    CLOUD_STORAGE = "GC"
    # Google Cloud Configuration
    GCP_PATH = "./generics/helpers/credentials/sl-dev-storage.json"
    GCP_BUCKET_NAME = "gcp bucket name"
    MONGODB_URL = mongodb://localhost:27017
    PUBLIC_FOLDER_PATH = "public"
    DB = "Samiksha20"

# For reports generation.

INTERNAL_ACCESS_TOKEN = "8c3a94f0931e01a4940a"

# CSV Config

# Create the respective directory as provided in the path below.

CSV_REPORTS_PATH = "reports"

# IMPROVEMENT PROJECT SERVICE

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
