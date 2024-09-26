#!/bin/bash

# Exit on error
set -e

# Ensure correct number of arguments are provided
if [ $# -lt 2 ]; then
    echo "Error: Folder name and database URL not provided. Usage: $0 <folder_name> <database_url>"
    exit 1
fi

# Use the provided folder name
FOLDER_NAME="sample-data/$1"

# Check if folder exists
if [ ! -d "$FOLDER_NAME" ]; then
    echo "Error: Folder '$FOLDER_NAME' not found."
    exit 1
fi

# Use the provided database URL
DEV_DATABASE_URL="$2"

# Extract database credentials and connection details using awk for portability
DB_USER=$(echo $DEV_DATABASE_URL | awk -F '[:@/]' '{print $4}')
DB_PASSWORD=$(echo $DEV_DATABASE_URL | awk -F '[:@/]' '{print $5}')
DB_HOST=$(echo $DEV_DATABASE_URL | awk -F '[:@/]' '{print $6}')
DB_PORT=$(echo $DEV_DATABASE_URL | awk -F '[:@/]' '{split($7,a,"/"); print a[1]}')
DB_NAME=$(echo $DEV_DATABASE_URL | awk -F '/' '{print $NF}')

# Log database variables
echo "Extracted Database Variables:"
echo "DB_USER: $DB_USER"
echo "DB_PASSWORD: $DB_PASSWORD"
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "DB_NAME: $DB_NAME"

# Define the container name (same as DB_HOST)
CONTAINER_NAME="$DB_HOST"

# Wait for Docker container to be up
echo "Waiting for Docker container '$CONTAINER_NAME' to be up..."
while ! docker inspect "$CONTAINER_NAME" &>/dev/null; do
    echo "Waiting for container..."
    sleep 1
done
echo "Container is now up."

# Wait for PostgreSQL to be ready to accept connections
echo "Waiting for PostgreSQL on '$DB_HOST:$DB_PORT' to accept connections..."
until docker exec "$CONTAINER_NAME" bash -c "pg_isready -h localhost -p $DB_PORT -U $DB_USER"; do
    echo "Waiting for database to be ready..."
    sleep 1
done
echo "Database is ready."

# Function to check if the database exists
check_database() {
    docker exec "$CONTAINER_NAME" bash -c "PGPASSWORD='$DB_PASSWORD' psql -h localhost -U $DB_USER -p $DB_PORT -lqt | cut -d \| -f 1 | grep -qw '$DB_NAME'"
}

echo "Checking existence of database '$DB_NAME'..."
until check_database; do
    echo "Database '$DB_NAME' does not exist, waiting..."
    sleep 5
done
echo "Database '$DB_NAME' exists, proceeding with script."

# Retrieve and prepare SQL file operations
SAMPLE_COLUMNS_FILE="$FOLDER_NAME/sampleData.sql"
if [ ! -f "$SAMPLE_COLUMNS_FILE" ]; then
    echo "Error: sampleData.sql not found in folder '$FOLDER_NAME'."
    exit 1
fi
echo "Copying sampleData.sql to container '$CONTAINER_NAME'..."
docker cp "$SAMPLE_COLUMNS_FILE" "$CONTAINER_NAME:/sampleData.sql"

echo "Creating Citus extension in the database..."
docker exec --user "$DB_USER" "$CONTAINER_NAME" bash -c "PGPASSWORD='$DB_PASSWORD' psql -h localhost -U $DB_USER -d $DB_NAME -p $DB_PORT -c 'CREATE EXTENSION IF NOT EXISTS citus;'"

# Function to check if table exists
check_table() {
    local table=$1
    local exists=$(docker exec "$CONTAINER_NAME" bash -c "PGPASSWORD='$DB_PASSWORD' psql -h localhost -U $DB_USER -d $DB_NAME -p $DB_PORT -t -c \"SELECT EXISTS(SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = '$table');\"")
    exists=$(echo "$exists" | tr -d '[:space:]')             # Trim whitespace
    echo "Debug: exists result for table $table = '$exists'" # Debug line
    [[ "$exists" == "t" ]]                                   # Checking specifically for 't'
}

# Execute the SQL file with checks for table existence
echo "Inserting Sample Data"
while IFS= read -r line; do
    # Regex pattern to match INSERT statements and capture the table name
    if [[ $line =~ ^INSERT\ INTO\ ([a-zA-Z0-9_\.]+)\  ]]; then
        # Capture the full table name from the regex match
        full_table_name="${BASH_REMATCH[1]}"
        # Temporarily modify the table name for checking existence (remove 'public.')
        check_table_name="$full_table_name"
        if [[ $check_table_name == public.* ]]; then
            check_table_name="${check_table_name#public.}"
        fi

        echo "Checking existence of table '$check_table_name'..."

        # Wait until the table exists
        until check_table "$check_table_name"; do
            echo "Table '$check_table_name' does not exist, waiting..."
            sleep 1
        done

        echo "Table '$full_table_name' exists, executing: $line"
        # Execute the SQL command in the Docker container with the full table name
        docker exec --user "$DB_USER" "$CONTAINER_NAME" bash -c "PGPASSWORD='$DB_PASSWORD' psql -h localhost -U $DB_USER -d $DB_NAME -p $DB_PORT -c \"$line\""
    else
        # Execute the SQL command directly if not an INSERT command
        echo "Executing command: $line"
        docker exec --user "$DB_USER" "$CONTAINER_NAME" bash -c "PGPASSWORD='$DB_PASSWORD' psql -h localhost -U $DB_USER -d $DB_NAME -p $DB_PORT -c \"$line\""
    fi
done <"$SAMPLE_COLUMNS_FILE"

echo "Sample Data Insertion Completed"