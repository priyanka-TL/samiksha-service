#!/bin/bash

# Get the directory of the shell script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Set environment variables
export notification_env="$SCRIPT_DIR/notification_env"
export scheduler_env="$SCRIPT_DIR/scheduler_env"
export samiksha_env="$SCRIPT_DIR/samiksha_env"
export users_env="$SCRIPT_DIR/user_env"
export interface_env="$SCRIPT_DIR/interface_env"
export entity_management_env="$SCRIPT_DIR/entity_management_env"

# Run docker-compose
docker-compose -f "$SCRIPT_DIR/docker-compose-project.yml" down