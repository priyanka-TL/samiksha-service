#!/bin/bash

# Define the path of your docker-compose file
DOCKER_COMPOSE_FILE="docker-compose.yml"

# Check if the Docker Compose file exists
if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
    echo "Error: Docker Compose file '$DOCKER_COMPOSE_FILE' does not exist."
    exit 1
fi

# Get the current directory path
CURRENT_DIR=$(pwd)

# Escape the current directory path to be used in a sed expression
ESCAPED_CURRENT_DIR=$(printf '%s\n' "$CURRENT_DIR" | sed -e 's/[\/&]/\\&/g')

# Use sed to replace the path leading up to 'environment.ts' in the docker-compose file
# The pattern ensures that it only replaces the path component up to ':/app/src/environments/environment.ts'
sed -i -e "s|/[^:]*\(\/environment\.ts\):/app/src/environments/environment.ts|$ESCAPED_CURRENT_DIR\1:/app/src/environments/environment.ts|" "$DOCKER_COMPOSE_FILE"

echo "Updated volume path for 'environment.ts' in $DOCKER_COMPOSE_FILE"
