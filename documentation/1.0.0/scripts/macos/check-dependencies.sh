#!/bin/bash

# Define ANSI color codes for output formatting
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check Node.js installation
check_nodejs() {
    if command -v node >/dev/null 2>&1; then
        echo -e "${GREEN}Node.js is installed. Version: $(node --version)${NC}"
    else
        echo -e "${RED}Node.js is not installed.${NC}"
    fi
}

# Function to check Kafka installation and running status
check_kafka() {
    if brew list | grep -q kafka; then
        echo -e "${GREEN}Kafka is installed.${NC}"

        kafka_status=$(brew services list | grep kafka | awk '{print $2}')
        echo "Kafka Status: $kafka_status"

        if [ "$kafka_status" == "started" ]; then
            echo -e "${GREEN}Kafka service is running.${NC}"
        else
            echo -e "${RED}Kafka service is not running.${NC}"
        fi
    else
        echo -e "${RED}Kafka is not installed.${NC}"
    fi

    if brew list | grep -q zookeeper; then
        zookeeper_status=$(brew services list | grep zookeeper | awk '{print $2}')
        echo "Zookeeper Status: $zookeeper_status"

        if [ "$zookeeper_status" == "started" ]; then
            echo -e "${GREEN}Zookeeper service is running.${NC}"
        else
            echo -e "${RED}Zookeeper service is not running.${NC}"
        fi
    else
        echo -e "${RED}Zookeeper is not installed.${NC}"
    fi
}

# Function to check Redis installation and service
check_redis() {
    if command -v redis-server >/dev/null 2>&1; then
        echo -e "${GREEN}Redis server is installed. Version: $(redis-server --version | head -n 1)${NC}"
    else
        echo -e "${RED}Redis server is not installed.${NC}"
        return
    fi

    if brew services list | grep -q "redis"; then
        echo -e "${GREEN}Redis service is running.${NC}"
    else
        echo -e "${RED}Redis service is not running.${NC}"
    fi
}

# Function to check Redis BullMQ installation
check_bullmq() {
    # BullMQ is a Node.js package, so we check if it's installed globally
    if npm list -g bullmq >/dev/null 2>&1; then
        echo -e "${GREEN}BullMQ is installed globally.${NC}"
    else
        echo -e "${RED}BullMQ is not installed.${NC}"
    fi
}

# Function to check MongoDB installation and service
check_mongodb() {
    if brew list | grep -q mongodb-community; then
        echo -e "${GREEN}MongoDB is installed.${NC}"

        mongodb_status=$(brew services list | grep mongodb-community | awk '{print $2}')
        echo "MongoDB Status: $mongodb_status"

        if [ "$mongodb_status" == "started" ]; then
            echo -e "${GREEN}MongoDB service is running.${NC}"
        else
            echo -e "${RED}MongoDB service is not running.${NC}"
        fi
    else
        echo -e "${RED}MongoDB is not installed.${NC}"
    fi
}

# Function to check PM2 installation
check_pm2() {
    if command npx pm2 -v >/dev/null 2>&1; then
        echo -e "${GREEN}PM2 is installed. Version: $(npx pm2 -v)${NC}"
    else
        echo -e "${RED}PM2 is not installed.${NC}"
    fi
}

# Function to check PostgreSQL installation and service
check_postgres() {
    if command -v psql >/dev/null 2>&1; then
        echo -e "${GREEN}PostgreSQL is installed. Version: $(psql --version | head -n 1)${NC}"
    else
        echo -e "${RED}PostgreSQL is not installed.${NC}"
        return
    fi

    if brew services list | grep -q "postgresql"; then
        echo -e "${GREEN}PostgreSQL service is running.${NC}"
    else
        echo -e "${RED}PostgreSQL service is not running.${NC}"
    fi
}

# Main execution flow of the script
echo "Survey Service Dependencies Status"

check_nodejs
check_kafka
check_redis
check_bullmq
check_mongodb
check_pm2
check_postgres
