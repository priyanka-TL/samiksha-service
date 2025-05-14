#!/bin/bash

# Define color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Function to show the menu
show_menu() {
    echo -e "${GREEN}Please choose an option to uninstall:${NC}"
    echo "1) PM2"
    echo "2) Node.js and npm"
    echo "3) Kafka and Zookeeper"
    echo "4) Redis"
    echo "5) Citus and PostgreSQL"
    echo "6) OpenJDK 11"
    echo "7) MongoDB"
    echo "8) Exit"
    echo -e "${GREEN}Enter your choice [1-8]: ${NC}"
}

# Function to uninstall PM2
uninstall_pm2() {
    echo -e "${RED}Uninstalling PM2...${NC}"
    sudo npm uninstall -g pm2
}

# Function to uninstall Node.js and npm
uninstall_nodejs() {
    echo -e "${RED}Uninstalling Node.js and npm...${NC}"
    sudo apt-get remove -y nodejs
    sudo apt-get purge -y nodejs
    sudo apt-get autoremove -y
}

# Function to uninstall Kafka and Zookeeper
uninstall_kafka_zookeeper() {
    echo -e "${RED}Removing Kafka and Zookeeper...${NC}"
    sudo systemctl stop kafka
    sudo systemctl disable kafka
    sudo systemctl stop zookeeper
    sudo systemctl disable zookeeper
    sudo rm /etc/systemd/system/kafka.service
    sudo rm /etc/systemd/system/zookeeper.service
    sudo rm -rf /opt/kafka
    sudo systemctl daemon-reload
}

# Function to uninstall Redis
uninstall_redis() {
    echo -e "${RED}Uninstalling Redis...${NC}"
    sudo systemctl stop redis
    sudo systemctl disable redis
    sudo apt-get remove -y redis-server
    sudo apt-get purge -y redis-server
    sudo apt-get autoremove -y
}

# Function to uninstall Citus and PostgreSQL
uninstall_citus_postgresql() {
    echo -e "${RED}Uninstalling Citus and PostgreSQL...${NC}"
    sudo su - postgres -c "pg_ctl -D ~/citus stop"
    sudo apt-get remove -y postgresql-16-citus-12.1
    sudo apt-get purge -y postgresql-16-citus-12.1
    sudo apt-get remove -y postgresql*
    sudo apt-get purge -y postgresql*
    sudo apt-get autoremove -y
    sudo pkill -u postgres
    sudo deluser --remove-home postgres
}

# Function to uninstall OpenJDK 11
uninstall_openjdk() {
    echo -e "${RED}Uninstalling OpenJDK 11...${NC}"
    sudo apt-get remove -y openjdk-11-jdk
    sudo apt-get purge -y openjdk-11-jdk
    sudo apt-get autoremove -y
}

# Function to uninstall MongoDB
uninstall_mongodb() {
    echo -e "${RED}Uninstalling MongoDB...${NC}"
    sudo systemctl stop mongod
    sudo systemctl disable mongod
    sudo apt-get remove -y mongodb-org
    sudo apt-get purge -y mongodb-org
    sudo apt-get autoremove -y
    sudo rm -r /var/log/mongodb
    sudo rm -r /var/lib/mongodb
}

# Main loop
while true; do
    show_menu
    read choice
    case $choice in
        1) uninstall_pm2 ;;
        2) uninstall_nodejs ;;
        3) uninstall_kafka_zookeeper ;;
        4) uninstall_redis ;;
        5) uninstall_citus_postgresql ;;
        6) uninstall_openjdk ;;
        7) uninstall_mongodb ;;
        8) echo -e "${GREEN}Exiting uninstallation process.${NC}"; exit ;;
        *) echo -e "${RED}Invalid option, please try again.${NC}" ;;
    esac
    echo -e "${GREEN}Operation completed.${NC}"
done
