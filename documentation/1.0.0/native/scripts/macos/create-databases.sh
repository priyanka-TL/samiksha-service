#!/bin/bash

# Run commands as the postgres user
psql -p 5432 -c "CREATE USER postgres WITH ENCRYPTED PASSWORD 'postgres';"

# Create the user database and assign privileges
psql -p 5432 -c "CREATE DATABASE users;"
psql -p 5432 -d users -c "GRANT ALL PRIVILEGES ON DATABASE users TO postgres;"
psql -p 5432 -d users -c "GRANT ALL ON SCHEMA public TO postgres;"

# Create the notification database and assign privileges
psql -p 5432 -c "CREATE DATABASE notification;"
psql -p 5432 -d notification -c "GRANT ALL PRIVILEGES ON DATABASE notification TO postgres;"
psql -p 5432 -d notification -c "GRANT ALL ON SCHEMA public TO postgres;"

echo "Database setup complete."