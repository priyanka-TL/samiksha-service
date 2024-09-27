
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

  

## Sample Data Creation For Projects

>  **Warning:** upload related apis will not work because cloud integration is not enabled in this set-up.

  

</details>

  

<details>

<summary>Natively Installed Services & Dependencies </summary>

  

  

## PM2 Managed Services & Natively Installed Dependencies

  

  

Expectation: Upon following the prescribed steps, you will achieve a fully operational Survey application setup. Both the portal and backend services are managed using PM2, with all dependencies installed natively on the host system.

  

  

## Prerequisites

  

  

Before setting up the following Survey application, dependencies given below should be installed and verified to be running. Refer to the steps given below to install them and verify.

  

  

-  **Ubuntu/Linux**

  

  

1. Download dependency management scripts:

```
curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/scripts/linux/check-dependencies.sh && \
curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/scripts/linux/install-dependencies.sh && \
curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/scripts/linux/uninstall-dependencies.sh && \
chmod +x check-dependencies.sh && \
chmod +x install-dependencies.sh && \
chmod +x uninstall-dependencies.sh

```
2. Verify installed dependencies by running `check-dependencies.sh`:

```
./check-dependencies.sh

```

> Note: Keep note of any missing dependencies.

  

  

3. Install dependencies by running `install-dependencies.sh`:

```
./install-dependencies.sh

```
> Note: Install all missing dependencies and use check-dependencies script to ensure everything is installed and running.

  

4. Uninstall dependencies by running `uninstall-dependencies.sh`:

```
./uninstall-dependencies.sh

```

> Warning: Due to the destructive nature of the script (without further warnings), it should only be used during the initial setup of the dependencies. For example, Uninstalling PostgreSQL/Citus using script will lead to data loss. USE EXTREME CAUTION.

  

  

> Warning: This script should only be used to uninstall dependencies that were installed via installation script in step 3. If same dependencies were installed using other methods, refrain from using this script. This script is provided in-order to reverse installation in-case issues arise from a bad install.

  

  

-  **MacOS**

  

  

1. Install Node.js 20:

```
brew install node@20

```

```
brew link --overwrite node@20

```

2. Install Kafka:

```
brew install kafka

```

3. Install PostgreSQL 16:

```
brew install postgresql@16

```

4. Install PM2:

```
sudo npm install pm2@latest -g

```

5. Install Redis:

```
brew install redis

```
6. Install Mongo:

```
brew install mongodb-community@7.0

```

7. Download `check-dependencies.sh` file:

```
curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/scripts/macos/check-dependencies.sh && \

  

chmod +x check-dependencies.sh

```

8. Verify installed dependencies by running `check-dependencies.sh`:

```
./check-dependencies.sh

```
## Installation

  

  

1.  **Create Elevate-service Directory:** Create a directory named **elevate-service**.

  

  

> Example Command: `mkdir elevate-service && cd elevate-service/`

  

  

2.  **Git Clone Services And Portal Repositories**

  

  

-  **Ubuntu/Linux/MacOS**

```
git clone -b main https://github.com/ELEVATE-Project/samiksha-service.git && \

git clone -b main https://github.com/ELEVATE-Project/entity-management.git && \

git clone -b release-2.6.1 https://github.com/ELEVATE-Project/user.git && \

git clone -b release-2.6.1 https://github.com/ELEVATE-Project/notification.git && \

git clone -b release-2.6.1 https://github.com/ELEVATE-Project/interface-service.git && \

git clone -b release-2.6.1 https://github.com/ELEVATE-Project/scheduler.git && \

git clone -b main https://github.com/ELEVATE-Project/observation-survey-projects-pwa.git

``` 

3.  **Install NPM Packages**

  

  

-  **Ubuntu/Linux/MacOS**

    ```
    cd samiksha-service && npm install && cd ../ && \
    cd user/src && npm install && cd ../.. && \
    cd notification/src && npm install && cd ../.. && \
    cd interface-service/src && npm install && cd ../.. && \
    cd scheduler/src && npm install && cd ../.. && \
    cd observation-survey-projects-pwa && npm install --force && cd ..

```  

4.  **Download Environment Files**

  

  

    -  **Ubuntu/Linux**

    ```
    curl -L -o samiksha-service/.env https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/envs/survey_service_env && \

    curl -L -o user/src/.env https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/envs/user_env && \

    curl -L -o notification/src/.env https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/envs/notification_env && \

    curl -L -o interface-service/src/.env https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/envs/interface_env && \

    curl -L -o scheduler/src/.env https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/envs/scheduler_env && \

    curl -L -o observation-survey-projects-pwa/src/environments/environment.ts https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/envs/environment.ts

```

-  **MacOS**

    ```
    curl -L -o samiksha-service/.env https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/envs/survey_service_env && \

    curl -L -o user/src/.env https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/envs/user_env && \

    curl -L -o notification/src/.env https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/envs/notification_env && \

    curl -L -o interface-service/src/.env https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/envs/interface_env && \

    curl -L -o scheduler/src/.env https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/envs/scheduler_env && \

    curl -L -o observation-survey-projects-pwa/src/environments/environment.ts https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/envs/environment.ts

    ```

>  **Note:** Modify the environment files as necessary for your deployment using any text editor, ensuring that the values are appropriate for your environment. The default values provided in the current files are functional and serve as a good starting point. Refer to the sample env files provided at the [Survey](https://github.com/ELEVATE-Project/samiksha/blob/master/src/.env.sample), [User](https://github.com/ELEVATE-Project/user/blob/master/src/.env.sample), [Notification](https://github.com/ELEVATE-Project/notification/blob/master/src/.env.sample), [Scheduler](https://github.com/ELEVATE-Project/scheduler/blob/master/src/.env.sample), and [Interface](https://github.com/ELEVATE-Project/interface-service/blob/main/src/.env.sample) repositories for reference.

  

  

>  **Caution:** While the default values in the downloaded environment files enable the Survey Application to operate, certain features may not function correctly or could be impaired unless the adopter-specific environment variables are properly configured.

  

>

  

> For detailed instructions on adjusting these values, please consult the **[Survey Environment Variable Modification Guide](https://github.com/ELEVATE-Project/mentoring/blob/master/documentation/1.0.0/Survey-Env-Modification-README.md)**.

  

  

>  **Important:** As mentioned in the above linked document, the **User SignUp** functionality may be compromised if key environment variables are not set correctly during deployment. If you opt to skip this setup, consider using the sample user account generator detailed in the `Sample User Accounts Generation` section of this document.

  

  

5.  **Create Databases**

  

  

-  **Ubuntu/Linux**

  

1. Download `create-databases.sh` Script File:

```
curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/scripts/linux/create-databases.sh

```
2. Make the executable by running the following command:

```
chmod +x create-databases.sh

```
3. Run the script file:

```
./create-databases.sh

```
-  **MacOS**

  

  

1. Download `create-databases.sh` Script File:

```
curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/scripts/macos/create-databases.sh

```
2. Make the executable by running the following command:

```
chmod +x create-databases.sh

```
3. Run the script file:

```
./create-databases.sh

```

6.  **Run Migrations To Create Tables**

  

  

-  **Ubuntu/Linux/MacOS**

  

  

1. Install Sequelize-cli globally:

```
sudo npm i sequelize-cli -g

```
2. Run Migrations:

```
cd user/src && npx sequelize-cli db:migrate && cd ../.. && \

cd notification/src && npx sequelize-cli db:migrate && cd ../..

```

  
  

7.  **Enabling Citus And Setting Distribution Columns (Optional)**

  

To boost performance and scalability, users can opt to enable the Citus extension. This transforms PostgreSQL into a distributed database, spreading data across multiple nodes to handle large datasets more efficiently as demand grows.

  

> NOTE: Currently only available for Linux based operation systems.

  

1. Download user `distributionColumns.sql` file.

```

curl -o ./user/distributionColumns.sql -JL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/user/distributionColumns.sql

```
2. Set up the `citus_setup` file by following the steps given below.

  

-  **Ubuntu/Linux**

  

1. Download the `citus_setup.sh` file:

```

curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/scripts/linux/citus_setup.sh

```
2. Make the setup file executable by running the following command:

```

chmod +x citus_setup.sh

```
3. Enable Citus and set distribution columns for `user` database by running the `citus_setup.sh`with the following arguments.

```

./citus_setup.sh user postgres://postgres:postgres@localhost:9700/users

```
8.  **Insert Initial Data**

  

Use Survey in-build seeders to insert the initial data.

  

  

-  **Ubuntu/Linux/MacOS**


```
cd samiksha-service && npm run db:populate-data && cd ../.. && \

cd user/src && npm run db:seed:all && cd ../..

```  

9.  **Start The Services**

  

  

Following the steps given below, 2 instances of each MentorEd backend service will be deployed and be managed by PM2 process manager.

  

  

-  **Ubuntu/Linux**

```
cd samiksha-service && pm2 start app.js -i 2 --name survey-service && cd ../ && \
cd user/src && pm2 start app.js -i 2 --name survey-user && cd ../.. && \
cd notification/src && pm2 start app.js -i 2 --name survey-notification && cd ../.. && \
cd interface-service/src && pm2 start app.js -i 2 --name survey-interface && cd ../.. && \
cd scheduler/src && pm2 start app.js -i 2 --name survey-scheduler && cd ../..

```

-  **MacOS**

```

cd samiksha-service && npx pm2 start app.js -i 2 --name survey-service && cd ../ && \
cd user/src && npx pm2 start app.js -i 2 --name survey-user && cd ../.. && \
cd notification/src && npx pm2 start app.js -i 2 --name survey-notification && cd ../.. && \
cd interface-service/src && npx pm2 start app.js -i 2 --name survey-interface && cd ../.. && \
cd scheduler/src && npx pm2 start app.js -i 2 --name survey-scheduler && cd ../..

```


10.  **Run Service Scripts**

  

  

-  **Ubuntu/Linux/MacOS**

```
cd user/src/scripts && node insertDefaultOrg.js && node viewsScript.js && \
node -r module-alias/register uploadSampleCSV.js && cd ../../..

```

11.  **Start The Portal**

  

  

Survey portal utilizes Ionic and Angular CLI for building the browser bundle, follow the steps given below to install them and start the portal.

  

  

-  **Ubuntu/Linux**

  

  

1. Install Ionic CLI globally:

```
sudo npm install -g @ionic/cli

```

2. Install Angular CLI globally:

```
sudo npm install -g @angular/cli

```

3. Navigate to `observation-survey-projects-pwa` directory:

```
cd observation-survey-projects-pwa

```

4. Build the portal

```
ionic build

```

5. Start the portal:

```
ionic serve

```

-  **MacOS**

  

  

1. Install Ionic CLI globally:

```
sudo npm install -g @ionic/cli

```

2. Install Angular CLI globally:

```
sudo npm install -g @angular/cli

```

3. Navigate to `observation-survey-projects-pwa` directory:

```
cd observation-survey-projects-pwa

```

4. Build the portal:

```
npx ionic build

```

5. Start the portal:

```
npx ionix serve

```

-  **Windows**

  

  

1. Install Ionic CLI globally:

```
npm install -g @ionic/cli

```

2. Install Angular CLI globally:

```
npm install -g @angular/cli

```

3. Navigate to `observation-survey-projects-pwa` directory:

```
cd observation-survey-projects-pwa

```

4. Build the portal

```
ionic build

```

5. Start the portal:

```
ionic serve

```

Navigate to http://localhost:8100 to access the Survey Portal.

  

  

## Sample User Accounts Generation

  

  

During the initial setup of Survey services with the default configuration, you may encounter issues creating new accounts through the regular SignUp flow on the Survey portal. This typically occurs because the default SignUp process includes OTP verification to prevent abuse. Until the notification service is configured correctly to send actual emails, you will not be able to create new accounts.

  

  

In such cases, you can generate sample user accounts using the steps below. This allows you to explore the Survey services and portal immediately after setup.

  

  

>  **Warning:** Use this generator only immediately after the initial system setup and before any normal user accounts are created through the portal. It should not be used under any circumstances thereafter.

  

-  **Ubuntu/Linux**

```

curl -o insert_sample_data.sh https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/scripts/linux/insert_sample_data.sh && \

chmod +x insert_sample_data.sh && \

./insert_sample_data.sh

```
After successfully running the script mentioned above, the following user accounts will be created and available for login:

  

  

| Email ID | Password | Role |

  

| ------------------------ | ---------- | ------------------ |

  

| aaravpatel@example.com | Password1@ | Mentee |

  

| arunimareddy@example.com | Password1@ | Mentor |

  

| devikasingh@example.com | Password1@ | Organization Admin |

  

  

</details>

```sql

  

postgres=# select citus_version();

  

citus_version

  

----------------------------------------------------------------------------------------------------

  

Citus 12.1.1  on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 9.4.0-1ubuntu1~20.04.2) 9.4.0, 64-bit

  

(1  row)

```