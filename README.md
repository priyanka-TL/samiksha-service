<div align="center">

# Survey Service

<a href="https://shikshalokam.org/elevate/">
<img
    src="https://shikshalokam.org/wp-content/uploads/2021/06/elevate-logo.png"
    height="140"
    width="300"
  />
</a>

</br>

The Survey building block enables creation, consumption of Survey,Observation and report capabilities.

  

</div>

  
# Supported Operating Systems

-   **Ubuntu (Recommended: Version 20 and above)** 
-   **Windows (Recommended: Version 11 and above)** 
-   **macOs (Recommended: Version 12 and above)**

# Setup Options

**Survey service can be setup in using two methods:**
> Note : This guide outlines two setup methods, detailed below. For a quick, beginner-friendly setup and walkthrough of services, it is recommended to use the Dockerized Services & Dependencies setup with the Docker-Compose file.

<details><summary>Dockerized Services & Dependencies Using Docker-Compose File</summary>


## Dockerized Services & Dependencies

Expectation: By diligently following the outlined steps, you will successfully establish a fully operational Survey application setup, including both the portal and backend services.

## Prerequisites

To set up the Survey application, ensure you have Docker and Docker Compose installed on your system. For Ubuntu users, detailed installation instructions for both can be found in the documentation here: [How To Install and Use Docker Compose on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04). For Windows and MacOS users, you can refer to the Docker documentation for installation instructions: [Docker Compose Installation Guide](https://docs.docker.com/compose/install/). Once these prerequisites are in place, you're all set to get started with setting up the Survey application.
 
## Installation

**Create survey Directory:** Create a directory named **survey**.

> Example Command: `mkdir survey && cd survey/`

> Note: All commands are run from the survey directory.
## Operating Systems: Linux / macOS

>**Caution:** Before proceeding, please ensure that the ports given here are available and open. It is essential to verify their availability prior to moving forward. You can run below command in your teminal to check this
```
for port in 3000 3001 3002 5001 4000 4301 5500 9092 5432 7007 2181 2707 3569; do
    if lsof -iTCP:$port -sTCP:LISTEN &>/dev/null; then
        echo "Port $port is in use"
    else
        echo "Port $port is available"
    fi
done
```

1.  **Download and execute main setup script:** Execute the following command in your terminal from the survey directory.
    ```
    curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/scripts/mac-linux/setup_survey.sh && chmod +x setup_survey.sh && ./setup_survey.sh
    ```

    > Note : The script will download all the essential files and launch the services in Docker. Once all services are successfully up and running, you can proceed to the next steps.

    **General Instructions :**

    1. All containers which are part of the docker-compose can be gracefully stopped by pressing Ctrl + c in the same terminal where the services are running.

    2. All docker containers can be stopped and removed by using below command.
        ```
        ./docker-compose-down.sh
        ```
    3. All services and dependencies can be started using below command.
        ```
        ./docker-compose-up.sh
        ```
**Keep the current terminal session active, and kindly open a new terminal window within the survey directory.**

**After successfully completing this, please move to the next section: [Enable Citus Extension](#enable-citus-extension-optional)**

## Operating Systems: Windows

1.  **Download Docker Compose File:** Retrieve the **[docker-compose.yml](https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/docker-compose.yml)** file from the Survey service repository and save it to the survey directory.

    ```
    curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/docker-compose.yml
    ```

    > Note: All commands are run from the survey directory.

2.  **Download Environment Files**: Using the OS specific commands given below, download environment files for all the services.
    -  **Windows**

        ```
        curl -L -O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/interface_env
        curl -L -O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/entity_management_env
        curl -L -O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/samiksha_env
        curl -L -O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/notification_env
        curl -L -O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/scheduler_env
        curl -L -O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/user_env
        curl -L -O https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/envs/env.js
        ```

>  **Note:** Modify the environment files as necessary for your deployment using any text editor, ensuring that the values are appropriate for your environment. The default values provided in the current files are functional and serve as a good starting point. Refer to the sample env files provided at the [Survey](https://github.com/ELEVATE-Project/samiksha-service/blob/main/.env.sample), [User](https://github.com/ELEVATE-Project/user/blob/master/src/.env.sample), [Notification](https://github.com/ELEVATE-Project/notification/blob/master/src/.env.sample), [Scheduler](https://github.com/ELEVATE-Project/scheduler/blob/master/src/.env.sample), [Interface](https://github.com/ELEVATE-Project/interface-service/blob/main/src/.env.sample) and [Entity-management](https://github.com/ELEVATE-Project/entity-management/blob/main/src/.env.sample) repositories for reference.

>  **Caution:** While the default values in the downloaded environment files enable the Project Application to operate, certain features may not function correctly or could be impaired unless the adopter-specific environment variables are properly configured.

3.  **Download `replace_volume_path` Script File**

    -  **Windows**
        ```
        curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/dockerized/scripts/windows/replace_volume_path.bat
        ```
5.  **Run `replace_volume_path` Script File**
   
    -  **Windows**
       Run the script file using the following command.
       ```
       replace_volume_path.bat
       ```

5. **Download `docker-compose-up` & `docker-compose-down` Script Files**

    -    **Windows**	
			```
		    curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/features_dockerSetup/documentation/1.0.0/dockerized/scripts/windows/docker-compose-up.bat
			```
		    ```
		    curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/scripts/windows/docker-compose-down.bat
			```

6.  **Run All Services & Dependencies:** All services and dependencies can be started using the `docker-compose-up` script file.

    -   **Windows**

	    ```
	    docker-compose-up.bat
	    ```

      > Double-click the file or run the above command from the terminal.

  

      > **Note**: During the first Docker Compose run, the database, migration seeder files, and the script to set the default organization will be executed automatically.

7.  **Remove All Service & Dependency Containers**:
   All docker containers can be stopped and removed by using the `docker-compose-down` file.

 - **Windows**

    ```
    docker-compose-down.bat
    ```
  
>  **Caution**: As per the default configuration in the `docker-compose.yml` file, using the `down` command will lead to data loss since the database container does not persist data. To persist data across `down` commands and subsequent container removals, refer to the "Persistence of Database Data in Docker Containers" section of this documentation.


## Enable Citus Extension (Optional)
 
User management service comes with this bundle relies on PostgreSQL as its core database system. To boost performance and scalability, users can opt to enable the Citus extension. This transforms PostgreSQL into a distributed database, spreading data across multiple nodes to handle large datasets more efficiently as demand grows.
  

For more information, refer **[Citus Data](https://www.citusdata.com/)**.
  
To enable the Citus extension for mentoring and user services, follow these steps.

1. Create a sub-directory named `user` and download `distributionColumns.sql` into it. (Skip for linux/mac setup)

    ```
    mkdir user && curl -o ./user/distributionColumns.sql -JL https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/distribution-columns/user/distributionColumns.sql
    ```
2. Set up the citus_setup file by following the steps given below.

-  **Ubuntu/Linux/Mac**

   1. Enable Citus and set distribution columns for `user` database by running the `citus_setup.sh`with the following arguments.

      ```
      ./citus_setup.sh user postgres://postgres:postgres@citus_master:5432/user
      ```

 - **Windows**

   1. Download the `citus_setup.bat` file.

      ```
      curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/scripts/windows/citus_setup.bat
      ```
      
   2. Enable Citus and set distribution columns for `user` database by running the `citus_setup.bat`with the following arguments.

      ```
      citus_setup.bat user postgres://postgres:postgres@citus_master:5432/user
      ```

   > **Note:** Since the `citus_setup.bat` file requires arguments, it must be run from a terminal.

  

## Persistence Of Database Data In Docker Container (Optional)

To ensure the persistence of database data when running `docker compose down`, it is necessary to modify the `docker-compose.yml` file according to the steps given below:

1.  **Modification Of The `docker-compose.yml` File:**

Begin by opening the `docker-compose.yml` file. Locate the section pertaining to the Citus and mongo container and proceed to uncomment the volume specification. This action is demonstrated in the snippet provided below:

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

-  **Ubuntu/Linux/Mac**

    
    ```
    ./insert_sample_data.sh user postgres://postgres:postgres@citus_master:5432/user
    ```

 - **Windows**
   1.  **Download The `sampleData.sql` Files:**

      ```
      mkdir sample-data\user 2>nul & ^curl -L https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/main/documentation/1.0.0/sample-data/windows/user/sampleData.sql     -o sample-data/user/sampleData.sql
      ```

   2.  **Download The `insert_sample_data` Script File:**
   - **Windows**

      ```
      curl -L -o insert_sample_data.bat https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/scripts/windows/insert_sample_data.bat
      ```

   3.  **Run The `insert_sample_data` Script File:**

   - **Windows**

      ```
      insert_sample_data.bat user postgres://postgres:postgres@citus_master:5432/user
      ```

After successfully running the script mentioned above, the following user accounts will be created and available for login:

| Email ID | Password | Role |
| ------------------------ | ---------- | ----------------------- |
| aaravpatel@example.com | Password1@ | State Education Officer |
| arunimareddy@example.com | Password1@ | State Education Officer |
| aaravpatel@example.com | Password1@ | State Education Officer |

## Sample Data Creation For Survey and Obseration

This step will guide us in implementing a sample survey and observation solutions following the initial setup of the survey service.
   -  **Ubuntu/Linux** && **Windows**

      ```
      docker exec -it samiksha sh -c "node documentation/1.0.0/dockerized/scripts/mac-linux/insert_sample_solutions.js"
      ```
      
## Insert Forms & Profile Configs Data into Database

- **Ubuntu/Linux/Mac**:
   ```
   curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/scripts/mac-linux/import_forms_mongo.sh && chmod +x import_forms_mongo.sh && ./import_forms_mongo.sh mongodb://mongo:27017/elevate-samiksha && \
   curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/scripts/mac-linux/add_profile_configuation.sh && chmod +x add_profile_configuation.sh && ./add_profile_configuation.sh
   ```
 - **Windows**:
   1.  **Download The `import_forms_mongo.bat` Files & Run The `import_forms_mongo.bat` Script File:**

      ```
      curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/dockerized/scripts/windows/import_forms_mongo.bat && curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/dockerized/scripts/windows/modifyform.js && import_forms_mongo.bat mongodb://localhost:27017/elevate-samiksha
      ```

## Explore the Portal
Once the services are up and the front-end app bundle is built successfully, navigate to **[localhost:7007](http://localhost:7007/)** to access the survey app.

> **Note:** In this setup, features such as **Sign-Up,file uploads** will not be available because cloud storage credentials have been masked in the environment files for security reasons.
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
      curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/scripts/linux/check-dependencies.sh && \
      curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/scripts/linux/install-dependencies.sh && \
      curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/scripts/linux/uninstall-dependencies.sh && \
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
    curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-    
    service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/scripts/macos/check-dependencies.sh && \
    chmod +x check-dependencies.sh
    ```

8. Verify installed dependencies by running `check-dependencies.sh`:

   ```
   ./check-dependencies.sh
   ```


-   **Windows**

    1. Install Node.js 20:

        Download and install Node.js v20 for Windows platform (x64) from official [Node.js download page](https://nodejs.org/en/download).

    2. Install Kafka 3.5.0:

        1. Adapt the instructions given in the following ["Apache Kafka on Windows"](https://www.conduktor.io/kafka/how-to-install-apache-kafka-on-windows/) documentation to install Kafka version 3.5.0.

            > Note: As per the instructions, Kafka server and Zookeeper has to be kept active on different WSL terminals for the entire lifetime of Survey services.

            > Note: Multiple WSL terminals can be opened by launching `Ubuntu` from start menu.

        2. Open a new WSL terminal and execute the following command to get the IP of the WSL instance.

            ```
            ip addr show eth0
            ```

            Sample Output:

            ```
            2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1492 qdisc mq state UP group default qlen 1000
            link/ether 11:56:54:f0:as:vf brd ff:ff:ff:ff:ff:ff
            inet 172.12.46.150/20 brd 172.24.79.255 scope global eth0
                valid_lft forever preferred_lft forever
            inet6 fe80::215:5dff:fee7:dc52/64 scope link
                valid_lft forever preferred_lft forever
            ```

            Keep note of the IP address shown alongside `inet`. In the above case, `172.12.46.150` is IP address of the WSL instance.

        3. In the same WSL terminal, navigate to `config` directory of Kafka from step 1 and make the following changes to `server.properties` file.

            - Uncomment `listeners=PLAINTEXT://:9092` line and change it to `listeners=PLAINTEXT://0.0.0.0:9092` to allow connections from any IP.

            - Uncomment `advertised.listeners` line and set it to `advertised.listeners=PLAINTEXT://172.12.46.150:9092`. Replace `172.12.46.150` with the actual IP address of your WSL instance.

        4. Restart the Zookeeper and Kafka Server from their own WSL terminals from step 1.

    3. Install Redis:

        1. Follow the instructions given in the official [Redis Documentation](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-windows/) to install Redis using WSL.

        2. Using the WSL terminal, open the Redis configuration file in a text editor, such as nano:

            ```
            sudo nano /etc/redis/redis.conf
            ```

        3. Find the line containing `bind 127.0.0.1 ::1` and change it to `bind 0.0.0.0 ::.`. This change allows Redis to accept connections from any IP address. Then save and exit the file.

        4. Restart Redis to apply the changes:

            ```
            sudo service redis-server restart
            ```

    4. Install PM2:

        ```
        npm install pm2@latest -g
        ```
    5. Install MongoDB:

        1. Adapt the instructions given in the following ["MongoDB Download Center."](https://www.mongodb.com/try/download/community) Choose the latest version or the version you need.

    5. Install PostgreSQL 16:

        1. Download and install PostgreSQL 16 from [EnterpriseDB PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) download page.

            > Note: Set username and password for the default database to be 'postgres' during installation.

        2. Once installed, Add `C:\Program Files\PostgreSQL\16\bin` to windows environment variables. Refer [here](https://www.computerhope.com/issues/ch000549.htm) or [here](https://stackoverflow.com/a/68851621) for more information regarding how to set it.
## Installation

1.  **Create Elevate-survey Directory:** Create a directory named **elevate-survey**.

   > Example Command: `mkdir elevate-survey && cd elevate-survey/`

2.  **Git Clone Services And Portal Repositories**

      -  **Ubuntu/Linux/MacOS**

         ```
         git clone -b main https://github.com/ELEVATE-Project/samiksha-service.git && \
         git clone -b main https://github.com/ELEVATE-Project/entity-management.git && \
         git clone -b master https://github.com/ELEVATE-Project/user.git && \
         git clone -b master https://github.com/ELEVATE-Project/notification.git && \
         git clone -b main https://github.com/ELEVATE-Project/interface-service.git && \
         git clone -b master https://github.com/ELEVATE-Project/scheduler.git && \
         git clone -b main https://github.com/ELEVATE-Project/observation-survey-projects-pwa.git
         ``` 
      -  **Windows**

         ```
         git clone -b main https://github.com/ELEVATE-Project/samiksha-service.git & ^
         git clone -b main https://github.com/ELEVATE-Project/entity-management.git & ^
         git clone -b master https://github.com/ELEVATE-Project/user.git & ^
         git clone -b master https://github.com/ELEVATE-Project/notification.git & ^
         git clone -b main https://github.com/ELEVATE-Project/interface-service.git & ^
         git clone -b master https://github.com/ELEVATE-Project/scheduler.git & ^
         git clone -b main https://github.com/ELEVATE-Project/observation-survey-projects-pwa.git
         ``` 



3.  **Install NPM Packages**

      -  **Ubuntu/Linux/MacOS**

         ```
         cd samiksha-service && npm install && cd ../ && \
         cd entity-management/src && npm install && cd ../.. && \
         cd user/src && npm install && cd ../.. && \
         cd notification/src && npm install && cd ../.. && \
         cd interface-service/src && npm install && cd ../.. && \
         cd scheduler/src && npm install && cd ../.. && \
         cd observation-survey-projects-pwa && npm install --force && cd ..
         ```  
      -  **Windows**

         ```
         cd samiksha-service & npm install & cd ..\ & ^
         cd user\src & npm install & cd ..\.. & ^
         cd notification\src & npm install & cd ..\.. & ^
         cd interface-service\src & npm install & cd ..\.. & ^
         cd scheduler\src & npm install & cd ..\.. & ^
         cd observation-survey-projects-pwa & npm install --force & cd ..
         ```  
         > Note: Entity-management service runs only on node-16 for Windows native setup.

         ```
         nvm use 16
         ```

         ```
         cd entity-management\src && npm install && cd ..\..
         ```

         > Note: Change the node version as it was before.


4.  **Download Environment Files**

      -  **Ubuntu/Linux**

         ```
         curl -L -o samiksha-service/.env https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/native/envs/survey_service_env && \
         curl -L -o entity-management/src/.env https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/native/envs/entity_management_env && \
         curl -L -o user/src/.env https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/native/envs/user_env && \
         curl -L -o notification/src/.env https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/native/envs/notification_env && \
         curl -L -o interface-service/src/.env https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/native/envs/interface_env && \
         curl -L -o scheduler/src/.env https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/native/envs/scheduler_env && \
         curl -L -o observation-survey-projects-pwa/src/environments/environment.ts https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/native/envs/environment.ts
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

      -  **Windows**

         ```
         curl -L -o samiksha-service\.env https://github.com/ELEVATE-Project/samiksha-service/blob/main/documentation/1.0.0/native/envs/survey_service_env & ^
         curl -L -o entity-management\src\.env https://github.com/ELEVATE-Project/samiksha-service/blob/main/documentation/1.0.0/native/envs/entity_management_env & ^
         curl -L -o user\src\.env https://github.com/ELEVATE-Project/samiksha-service/blob/main/documentation/1.0.0/native/envs/user_env & ^
         curl -L -o notification\src\.env https://github.com/ELEVATE-Project/samiksha-service/blob/main/documentation/1.0.0/native/envs/notification_env & ^
         curl -L -o interface-service\src\.env https://github.com/ELEVATE-Project/samiksha-service/blob/main/documentation/1.0.0/native/envs/interface_env & ^
         curl -L -o scheduler\src\.env https://github.com/ELEVATE-Project/samiksha-service/blob/main/documentation/1.0.0/native/envs/scheduler_env & ^
         curl -L -o observation-survey-projects-pwa\src\environments\environment.ts https://github.com/ELEVATE-Project/samiksha-service/blob/main/documentation/1.0.0/native/envs/enviroment.ts
         ```

         >  **Note:** Modify the environment files as necessary for your deployment using any text editor, ensuring that the values are appropriate for your environment. The default values provided in the current files are functional and serve as a good starting point. Refer to the sample env files provided at the [Survey](https://github.com/ELEVATE-Project/samiksha/blob/master/src/.env.sample), [User](https://github.com/ELEVATE-Project/user/blob/master/src/.env.sample), [Notification](https://github.com/ELEVATE-Project/notification/blob/master/src/.env.sample), [Scheduler](https://github.com/ELEVATE-Project/scheduler/blob/master/src/.env.sample), and [Interface](https://github.com/ELEVATE-Project/interface-service/blob/main/src/.env.sample) repositories for reference.

         >  **Caution:** While the default values in the downloaded environment files enable the Survey Application to operate, certain features may not function correctly or could be impaired unless the adopter-specific environment variables are properly configured.

         <!-- > For detailed instructions on adjusting these values, please consult the **[Survey Environment Variable Modification Guide](https://github.com/ELEVATE-Project/mentoring/blob/master/documentation/1.0.0/Survey-Env-Modification-README.md)**. -->

         >  **Important:** As mentioned in the above linked document, the **User SignUp** functionality may be compromised if key environment variables are not set correctly during deployment. If you opt to skip this setup, consider using the sample user account generator detailed in the `Sample User Accounts Generation` section of this document.

5.  **Create Databases**

      -  **Ubuntu/Linux**

         1. Download `create-databases.sh` Script File:

               ```
               curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/native/scripts/linux/create-databases.sh
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
            curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha- 
            service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/scripts/macos/create-databases.sh
            ```
         2. Make the executable by running the following command:

            ```
            chmod +x create-databases.sh
            ```
         3. Run the script file:

            ```
            ./create-databases.sh
            ```
            
      -  **Windows**

         1. Download `create-databases.bat` Script File:

            ```
            curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha- 
            service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/native/scripts/windows/create-databases.bat
            ```
         2. Run the script file:

            ```
            create-databases.bat
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
      -  **Windows**

         1. Run Migrations:

            ```
            cd user\src && npx sequelize-cli db:migrate && cd ..\.. &&
            cd notification\src && npx sequelize-cli db:migrate && cd ..\..
            ```

7.  **Enabling Citus And Setting Distribution Columns (Optional)**

      To boost performance and scalability, users can opt to enable the Citus extension. This transforms PostgreSQL into a distributed database, spreading data across multiple nodes to handle large datasets more efficiently as demand grows.

      1. Download user `distributionColumns.sql` file.

         -  **Linux/Ubuntu/MacOS**
            ```
            curl -o ./user/distributionColumns.sql -JL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/user/distributionColumns.sql
            ```
      
         -  **Windows**
            ```
            curl -o .\user\distributionColumns.sql -JL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/user/distributionColumns.sql
            ```

      2. Set up the `citus_setup` file by following the steps given below.

         - **Ubuntu/Linux**

            1. Download the `citus_setup.sh` file:
               ```
               curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/native/scripts/linux/citus_setup.sh
               ```

            2. Make the setup file executable by running the following command:
               ```
               chmod +x citus_setup.sh
               ```

            3. Enable Citus and set distribution columns for `user` database by running the `citus_setup.sh`with the following arguments.
               ```
               ./citus_setup.sh user postgres://postgres:postgres@localhost:9700/users
               ```
         
         - **Windows**

            1. Download the `citus_setup.bat` file:
               ```
               curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/native/scripts/windows/citus_setup.sh
               ```
            
            2. Enable Citus and set distribution columns for `user` database by running the `citus_setup.bat`with the following arguments.
               ```
               citus_setup.bat user postgres://postgres:postgres@localhost:9700/users
               ```

8.  **Insert Initial Data**

     - **Ubuntu/Linux/Mac/Windows**

        1. Download `insert_sample_solutions.js` Script File:

            ```
            curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/native/scripts/linux/insert_sample_solutions.js && \
            curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/native/scripts/linux/common.js && \
            curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/native/scripts/linux/entity_sampleData.js&& \
            curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/native/scripts/linux/observation_sampleData.js && \
            curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/native/scripts/linux/survey_sampleData.js

            ```

        2. Make the setup file executable by running the following command.

            ```
            node insert_sample_solutions.js
            ```

        3. Use Survey in-build seeders to insert the initial data.
            ```
            cd user/src && npm run db:seed:all && cd ../..
            ```  
     - **Windows**

        1. Use Survey in-build seeders to insert the initial data:
            ```
            cd user\src && npm run db:seed:all && cd ..\..
            ```  

9.  **Insert Forms Data into Database**

    -   **Ubuntu/Linux/MacOS/Windows**

        1.  Download `import_forms.js` Script File And Make the setup file executable by running the following command:

            ```
            curl -s https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/native/scripts/linux/import_forms.js | node
            ```

10. **Start The Services**

      Following the steps given below, 2 instances of each Survey backend service will be deployed and be managed by PM2 process manager. 
    -  **Ubuntu/Linux** 
         ```
         cd samiksha-service && pm2 start app.js --name survey-service && cd ../ && 
         cd entity-management/src && pm2 start app.js --name survey-entity-management && cd ../.. && 
         cd user/src && pm2 start app.js --name survey-user && cd ../.. && 
         cd notification/src && pm2 start app.js --name survey-notification && cd ../.. && 
         cd interface-service/src && pm2 start app.js --name survey-interface && cd ../.. && 
         cd scheduler/src && pm2 start app.js --name survey-scheduler && cd ../..
         ``` 

    -  **MacOS** 
         ```
         cd samiksha-service && npx pm2 start app.js -i 2 --name survey-service && cd ../ && \
         cd user/src && npx pm2 start app.js -i 2 --name survey-user && cd ../.. && \
         cd notification/src && npx pm2 start app.js -i 2 --name survey-notification && cd ../.. && \
         cd interface-service/src && npx pm2 start app.js -i 2 --name survey-interface && cd ../.. && \
         cd scheduler/src && npx pm2 start app.js -i 2 --name survey-scheduler && cd ../..
         ```

    -  **Windows** 
         ```
         cd samiksha-service && pm2 start app.js --name survey-service && cd ../ && ^
         cd entity-management/src && pm2 start app.js --name survey-entity-management && cd ../.. && ^
         cd user/src && pm2 start app.js --name survey-user && cd ../.. && ^
         cd notification/src && pm2 start app.js --name survey-notification && cd ../.. && ^
         cd interface-service/src && pm2 start app.js --name survey-interface && cd ../.. && ^
         cd scheduler/src && pm2 start app.js --name survey-scheduler && cd ../..
         ```


11.  **Run Service Scripts**

   -  **Ubuntu/Linux/MacOS**

      ```
      cd user/src/scripts && node insertDefaultOrg.js && node viewsScript.js && cd ../../..
      ```

   -  **Windows**

      ```
      cd user\src\scripts && node insertDefaultOrg.js && node viewsScript.js && cd ..\..\..
      ```

12.  **Start The Portal**

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



## Sample User Accounts Generation

   During the initial setup of Survey services with the default configuration, you may encounter issues creating new accounts through the regular SignUp flow on the Survey portal. This typically occurs because the default SignUp process includes OTP verification to prevent abuse. Until the notification service is configured correctly to send actual emails, you will not be able to create new accounts.
   In such cases, you can generate sample user accounts using the steps below. This allows you to explore the Survey services and portal immediately after setup.
   >  **Warning:** Use this generator only immediately after the initial system setup and before any normal user accounts are created through the portal. It should not be used under any circumstances thereafter.
-  **Ubuntu/Linux**

    ```
    curl -o insert_sample_data.sh https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/main/documentation/1.0.0/native/scripts/linux/insert_sample_data.sh && \
    chmod +x insert_sample_data.sh && \
    ./insert_sample_data.sh
    ```

-   **MacOS**

    ```
    curl -o insert_sample_data.sh https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/scripts/macos/insert_sample_data.sh && \
    chmod +x insert_sample_data.sh && \
    ./insert_sample_data.sh
    ```
-   **Windows**

    ```
    curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/feature/sample_data_scripts/documentation/1.0.0/scripts/windows/insert_sample_data.bat && insert_sample_data.bat
    ```

   After successfully running the script mentioned above, the following user accounts will be created and available for login:
   
   | Email ID                 | Password   | Role                      |
   | ------------------------ | ---------- | ------------------------- |
   | aaravpatel@example.com   | Password1@ | state_educational_officer |
   | arunimareddy@example.com | Password1@ | state_educational_officer |
   | devikasingh@example.com  | Password1@ | state_educational_officer |


## Explore the Portal
Once the services are up and the front-end app bundle is built successfully, navigate to **[localhost:8100](http://localhost:8100)** to access the survey app.

> **Note:** In this setup, features such as **Sign-Up,file uploads** will not be available because cloud storage credentials have been masked in the environment files for security reasons.


</details>

## Postman Collections

-   [Survey Service](https://github.com/ELEVATE-Project/samiksha-service/tree/main/api-doc)

## Adding New Surveys & Observations to the System
With implementation scripts, you can seamlessly add new projects to the system. Once a survey or observations are successfully added, it becomes visible on the portal, ready for use and interaction. For a comprehensive guide on setting up and using the implementation script, please refer to the [documentation here](https://github.com/ELEVATE-Project/samiksha-service/blob/main/implementation-script/README.md).


# Team

<a href="https://github.com/ELEVATE-Project/samiksha-service/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ELEVATE-Project/samiksha-service" />
</a>

# Open Source Dependencies

Several open source dependencies that have aided Survey servie's development:

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-000?style=for-the-badge&logo=apachekafka)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
