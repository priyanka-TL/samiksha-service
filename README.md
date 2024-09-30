<div align="center">

# Survey Service

<a href="https://shikshalokam.org/elevate/">
<img
    src="https://shikshalokam.org/wp-content/uploads/2021/06/elevate-logo.png"
    height="140"
    width="300"
  />
</a>

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/ELEVATE-Project/mentoring/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/ELEVATE-Project/mentoring/tree/master)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_mentoring&metric=duplicated_lines_density&branch=master)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_mentoring)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_mentoring&metric=coverage)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_mentoring)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_mentoring&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_mentoring)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)
[![Docs](https://img.shields.io/badge/Docs-success-informational)](https://elevate-docs.shikshalokam.org/mentorEd/intro)

![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/ELEVATE-Project/mentoring?filename=src%2Fpackage.json)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

<details><summary>CircleCI insights</summary>

[![CircleCI](https://dl.circleci.com/insights-snapshot/gh/ELEVATE-Project/mentoring/master/buil-and-test/badge.svg?window=30d)](https://app.circleci.com/insights/github/ELEVATE-Project/mentoring/workflows/buil-and-test/overview?branch=integration-testing&reporting-window=last-30-days&insights-snapshot=true)

</details>

<details><summary>develop</summary>

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/ELEVATE-Project/mentoring/tree/develop.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/ELEVATE-Project/mentoring/tree/develop)
![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/ELEVATE-Project/mentoring/develop?filename=src%2Fpackage.json)

[![CircleCI](https://dl.circleci.com/insights-snapshot/gh/ELEVATE-Project/mentoring/dev/buil-and-test/badge.svg?window=30d)](https://app.circleci.com/insights/github/ELEVATE-Project/mentoring/workflows/buil-and-test/overview?branch=develop&reporting-window=last-30-days&insights-snapshot=true)

[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_mentoring&metric=duplicated_lines_density&branch=develop)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_mentoring)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_mentoring&metric=coverage&branch=develop)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_mentoring)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_mentoring&metric=vulnerabilities&branch=develop)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_mentoring)

</details>

</br>
The Project building block enables creation, consumption of micro-improvement projects

</div>

# System Requirements

-   **Operating System:** Ubuntu 22/Windows 11/macos 12
-   **Node.js®:** v20
-   **PostgreSQL:** 16
-   **Apache Kafka®:** 3.5.0
-   **MongoDB:** 4.4.14
-   **Gotenberg:** 8.5.0

# Setup Options

**Elevate services can be setup in local using two methods:**

  

<details><summary>Dockerized Services & Dependencies Using Docker-Compose File</summary>

  

## Dockerized Services & Dependencies

  

Expectation: Upon following the prescribed steps, you will achieve a fully operational Project application setup, complete with both the portal and backend services.

  

## Prerequisites

  

To set up the Project application, ensure you have Docker and Docker Compose installed on your system. For Ubuntu users, detailed installation instructions for both can be found in the documentation here: [How To Install and Use Docker Compose on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04). For Windows and MacOS users, you can refer to the Docker documentation for installation instructions: [Docker Compose Installation Guide](https://docs.docker.com/compose/install/). Once these prerequisites are in place, you're all set to get started with setting up the Project application.

  

Service also uses gotenberg for creation of project certificate. You can read more about it here : [Gotenberg](https://gotenberg.dev/docs/getting-started/introduction).

  

## Installation

  

1.  **Create project Directory:** Create a directory named **project**.

  

> Example Command: `mkdir survey && cd survey/`

  

2.  **Download Docker Compose File:** Retrieve the **[docker-compose.yml](https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/docker-compose-project.yml)** file from the Project service repository and save it to the project directory.

```

curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/docker-compose-project.yml

```
> Note: All commands are run from the project directory.

  

Directory structure:

```

./survey

└── docker-compose.yml

```
3.  **Download Environment Files**: Using the OS specific commands given below, download environment files for all the services.

  

-  **Ubuntu/Linux/Mac**

```

curl -L \

-O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/interface_env \

-O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/entity_management_env \

-O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/samiksha_env \

-O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/notification_env \

-O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/scheduler_env \

-O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/user_env \

-O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/env.js

```

-  **Windows**

```

curl -L ^

-O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/interface_env \

-O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/entity_management_env \

-O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/samiksha_env \

-O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/notification_env \

-O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/scheduler_env \

-O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/user_env \

-O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/env.js

```
>  **Note:** Modify the environment files as necessary for your deployment using any text editor, ensuring that the values are appropriate for your environment. The default values provided in the current files are functional and serve as a good starting point. Refer to the sample env files provided at the [Samiksha](https://github.com/ELEVATE-Project/samiksha-service/blob/main/.env.sample), [User](https://github.com/ELEVATE-Project/user/blob/master/src/.env.sample), [Notification](https://github.com/ELEVATE-Project/notification/blob/master/src/.env.sample), [Scheduler](https://github.com/ELEVATE-Project/scheduler/blob/master/src/.env.sample), [Interface](https://github.com/ELEVATE-Project/interface-service/blob/main/src/.env.sample) and [Entity-management](https://github.com/ELEVATE-Project/entity-management/blob/main/src/.env.sample) repositories for reference.

  

>  **Caution:** While the default values in the downloaded environment files enable the Project Application to operate, certain features may not function correctly or could be impaired unless the adopter-specific environment variables are properly configured.

  

4.  **Download `replace_volume_path` Script File**

  

-  **Ubuntu/Linux/Mac**

```

curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/dockerized/scripts/mac-linux/replace_volume_path.sh

```
<!--

- **Windows**

```

curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/dockerized/scripts/windows/replace_volume_path.bat

```

-->

  

5.  **Run `replace_volume_path` Script File**

  

-  **Ubuntu/Linux/Mac**

1. Make the `replace_volume_path.sh` file an executable.

```

chmod +x replace_volume_path.sh

```

2. Run the script file using the following command.

```

./replace_volume_path.sh

```

  
  
  

6. ** Download `docker-compose-up` & `docker-compose-down` Script Files **

  

-  **Ubuntu/Linux/Mac**

  

1. Download the files.

```

curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/scripts/mac-linux/docker-compose-up.sh

```
```

curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/scripts/mac-linux/docker-compose-down.sh

```
2. Make the files executable by running the following commands.

```

chmod +x docker-compose-up.sh

```
```

chmod +x docker-compose-down.sh

```
<!-- - **Windows**

```

curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/features_dockerSetup/documentation/1.0.0/dockerized/scripts/windows/docker-compose-up.bat

```
```

curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/scripts/windows/docker-compose-down.bat

```

-->

  
  
  

7.  **Run All Services & Dependencies:**All services and dependencies can be started using the `docker-compose-up` script file.

  

-  **Ubuntu/Linux/Mac**

```

./docker-compose-up.sh

```
<!-- - **Windows**

```

docker-compose-up.bat

```

> Double-click the file or run the above command from the terminal.

> **Note**: During the first Docker Compose run, the database, migration seeder files, and the script to set the default organization will be executed automatically.

-->

  

8.  **Access The Survey Application**:Once the services are up and the front-end app bundle is built successfully, navigate to **[localhost:7007](http://localhost:7007/)** to access the Survey app.

9.  **Gracefully Stop All Services & Dependencies:**All containers which are part of the docker-compose can be gracefully stopped by pressing `Ctrl + c` in the same terminal where the services are running.

10.  **Remove All Service & Dependency Containers**:

All docker containers can be stopped and removed by using the `docker-compose-down` file.

  

-  **Ubuntu/Linux/Mac**

```

./docker-compose-down.sh

```
<!-- - **Windows**

```

docker-compose-down.bat

```

-->

  

>  **Caution**: As per the default configuration in the `docker-compose-mentoring.yml` file, using the `down` command will lead to data loss since the database container does not persist data. To persist data across `down` commands and subsequent container removals, refer to the "Persistence of Database Data in Docker Containers" section of this documentation.

  

## Enable Citus Extension

  

User management service comes with this bundle relies on PostgreSQL as its core database system. To boost performance and scalability, users can opt to enable the Citus extension. This transforms PostgreSQL into a distributed database, spreading data across multiple nodes to handle large datasets more efficiently as demand grows.

  

For more information, refer **[Citus Data](https://www.citusdata.com/)**.

  

To enable the Citus extension for mentoring and user services, follow these steps.

  

1. Create a sub-directory named `user` and download `distributionColumns.sql` into it.

```

mkdir user && curl -o ./user/distributionColumns.sql -JL https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/distribution-columns/user/distributionColumns.sql

```

2. Set up the citus_setup file by following the steps given below.

  

-  **Ubuntu/Linux/Mac**

  

1. Download the `citus_setup.sh` file.

```

curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/scripts/mac-linux/citus_setup.sh

```
2. Make the setup file executable by running the following command.

```

chmod +x citus_setup.sh

```
3. Enable Citus and set distribution columns for `user` database by running the `citus_setup.sh`with the following arguments.

```

./citus_setup.sh user postgres://postgres:postgres@localhost:5432/user

```
<!-- - **Windows**

1. Download the `citus_setup.bat` file.

```

curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/scripts/windows/citus_setup.bat

```

2. Enable Citus and set distribution columns for `user` database by running the `citus_setup.bat`with the following arguments.

```

citus_setup.bat user postgres://postgres:postgres@citus_master:5432/user

```

> **Note:** Since the `citus_setup.bat` file requires arguments, it must be run from a terminal.

-->

  

## Persistence Of Database Data In Docker Container

  

To ensure the persistence of database data when running `docker compose down`, it is necessary to modify the `docker-compose-project.yml` file according to the steps given below:

  

1.  **Modification Of The `docker-compose-project.yml` File:**

  

Begin by opening the `docker-compose-project.yml` file. Locate the section pertaining to the Citus and mongo container and proceed to uncomment the volume specification. This action is demonstrated in the snippet provided below:

```yaml

mongo:

image: 'mongo:4.4.14'

restart: 'always'

ports:

- '27017:27017'

networks:

- project_net

volumes:

- mongo-data:/data/db

logging:

driver: none

  

citus:

image: citusdata/citus:11.2.0

container_name: 'citus_master'

ports:

- 5432:5432

volumes:

- citus-data:/var/lib/postgresql/data

```
2.  **Uncommenting Volume Names Under The Volumes Section:**

  

Next, navigate to the volumes section of the file and proceed to uncomment the volume names as illustrated in the subsequent snippet:

```yaml

networks:

elevate_net:

external: false

  

volumes:

citus-data:

mongo-data:

```
By implementing these adjustments, the configuration ensures that when the `docker-compose down` command is executed, the database data is securely stored within the specified volumes. Consequently, this data will be retained and remain accessible, even after the containers are terminated and subsequently reinstated using the `docker-compose up` command.

  

## Sample User Accounts Generation

  

During the initial setup of Project services with the default configuration, you may encounter issues creating new accounts through the regular SignUp flow on the Survey portal. This typically occurs because the default SignUp process includes OTP verification to prevent abuse. Until the notification service is configured correctly to send actual emails, you will not be able to create new accounts.

  

In such cases, you can generate sample user accounts using the steps below. This allows you to explore the Project services and portal immediately after setup.

  

>  **Warning:** Use this generator only immediately after the initial system setup and before any normal user accounts are created through the portal. It should not be used under any circumstances thereafter.

  

1.  **Download The `sampleData.sql` Files:**

  

-  **Ubuntu/Linux/Mac**

```

mkdir -p sample-data/user && \

curl -L https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/main/documentation/1.0.0/sample-data/mac-linux/user/sampleData.sql -o sample-data/user/sampleData.sql

```
<!-- - **Windows**

```

mkdir sample-data\user 2>nul & ^

curl -L "https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/main/documentation/1.0.0/sample-data/windows/user/sampleData.sql" -o sample-data\user\sampleData.sql

--> ```
2.  **Download The `insert_sample_data` Script File:**

  

-  **Ubuntu/Linux/Mac**

```

curl -L -o insert_sample_data.sh https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/main/documentation/1.0.0/dockerized/scripts/mac-linux/insert_sample_data.sh && chmod +x insert_sample_data.sh

```
<!-- - **Windows**

```

curl -L -o insert_sample_data.bat https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/main/documentation/2.6.1/dockerized/scripts/windows/insert_sample_data.bat

```

-->

  

3.  **Run The `insert_sample_data` Script File:**

  

-  **Ubuntu/Linux/Mac**

```

./insert_sample_data.sh user postgres://postgres:postgres@citus_master:5432/user

```
<!-- - **Windows**

```

insert_sample_data.bat user postgres://postgres:postgres@citus_master:5432/user

```

-->

  

After successfully running the script mentioned above, the following user accounts will be created and available for login:

  

| Email ID | Password | Role |

| ------------------------ | ---------- | ----------------------- |

| aaravpatel@example.com | Password1@ | State Education Officer |

| arunimareddy@example.com | Password1@ | State Education Officer |

| aaravpatel@example.com | Password1@ | State Education Officer |

## Insert Initial Data

-  **Ubuntu/Linux**

  ```
docker exec -it samiksha sh -c "node documentation/1.0.0/dockerized/scripts/mac-linux/insert_sample_solutions.js"
  ```


## Sample Data Creation For Projects

>  **Warning:** upload related apis will not work because cloud integration is not enabled in this set-up.

  

</details>

  

<details>


  

</details>

```sql

  


```