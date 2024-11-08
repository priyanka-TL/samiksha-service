#!/bin/bash

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> setup_log.txt
}

# Step 1: Download Docker Compose file for Samiksha service
log "Downloading Samiksha Docker Compose file..."
curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/documentation-docker/documentation/1.0.0/dockerized/docker-compose.yml
log "Samiksha Docker Compose file downloaded."

# Step 2: Download environment files for Samiksha service
log "Downloading Samiksha environment files..."
curl -L \
    -O https://github.com/ELEVATE-Project/samiksha-service/raw/documentation-docker/documentation/1.0.0/dockerized/envs/interface_env \
    -O https://github.com/ELEVATE-Project/samiksha-service/raw/documentation-docker/documentation/1.0.0/dockerized/envs/entity_management_env \
    -O https://github.com/ELEVATE-Project/samiksha-service/raw/documentation-docker/documentation/1.0.0/dockerized/envs/samiksha_env \
    -O https://github.com/ELEVATE-Project/samiksha-service/raw/documentation-docker/documentation/1.0.0/dockerized/envs/notification_env \
    -O https://github.com/ELEVATE-Project/samiksha-service/raw/documentation-docker/documentation/1.0.0/dockerized/envs/scheduler_env \
    -O https://github.com/ELEVATE-Project/samiksha-service/raw/documentation-docker/documentation/1.0.0/dockerized/envs/user_env \
    -O https://github.com/ELEVATE-Project/samiksha-service/raw/documentation-docker/documentation/1.0.0/dockerized/envs/env.js
log "Samiksha environment files downloaded."

# Step 3: Download replace_volume_path.sh script for Samiksha service
log "Downloading replace_volume_path.sh script for Samiksha service..."
curl -OJL https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/refs/heads/documentation-docker/documentation/1.0.0/dockerized/scripts/mac-linux/replace_volume_path.sh
chmod +x replace_volume_path.sh
log "replace_volume_path.sh script downloaded and made executable."

# Step 4: Run replace_volume_path.sh script for Samiksha service
log "Running replace_volume_path.sh script..."
./replace_volume_path.sh
log "replace_volume_path.sh script executed."

# Step 5: Download docker-compose-up.sh and docker-compose-down.sh scripts for Samiksha service
log "Downloading docker-compose scripts for Samiksha service..."
curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/documentation-docker/documentation/1.0.0/dockerized/scripts/mac-linux/docker-compose-up.sh
curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/documentation-docker/documentation/1.0.0/dockerized/scripts/mac-linux/docker-compose-down.sh
curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/main/documentation/1.0.0/dockerized/scripts/windows/docker-compose-down.bat
chmod +x docker-compose-up.sh docker-compose-down.sh
log "Samiksha docker-compose scripts downloaded and made executable."

# Step 6: Create user directory and download distributionColumns.sql for Samiksha service
log "Creating user directory and downloading distributionColumns.sql for Samiksha service..."
mkdir -p user && curl -o ./user/distributionColumns.sql -JL https://github.com/ELEVATE-Project/samiksha-service/raw/documentation-docker/documentation/1.0.0/distribution-columns/user/distributionColumns.sql
log "User directory created and distributionColumns.sql downloaded."

# Step 7: Download and make citus_setup.sh executable for Samiksha service
log "Downloading citus_setup.sh for Samiksha service..."
curl -OJL https://github.com/ELEVATE-Project/samiksha-service/raw/documentation-docker/documentation/1.0.0/dockerized/scripts/mac-linux/citus_setup.sh
chmod +x citus_setup.sh
log "citus_setup.sh downloaded and made executable."

# Step 8: Create sample-data directory and download sampleData.sql for Samiksha service
log "Creating sample-data directory and downloading sampleData.sql for Samiksha service..."
mkdir -p sample-data/user && curl -L https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/documentation-docker/documentation/1.0.0/sample-data/mac-linux/user/sampleData.sql -o sample-data/user/sampleData.sql
log "Sample-data directory created and sampleData.sql downloaded."

# Step 9: Download and make insert_sample_data.sh executable for Samiksha service
log "Downloading insert_sample_data.sh for Samiksha service..."
curl -L -o insert_sample_data.sh https://raw.githubusercontent.com/ELEVATE-Project/samiksha-service/documentation-docker/documentation/1.0.0/dockerized/scripts/mac-linux/insert_sample_data.sh
chmod +x insert_sample_data.sh
log "insert_sample_data.sh downloaded and made executable."

# Step 10: Run docker-compose-up.sh script for Samiksha service
log "Running docker-compose-up.sh script for Samiksha service..."
./docker-compose-up.sh
log "docker-compose-up.sh script executed for Samiksha service."
