#!/bin/bash

# Extract the MongoDB connection string
MONGODB_URL="$1"

# Extract the database variables
DB_HOST=$(echo $MONGODB_URL | awk -F'[/:]' '{print $4}')
DB_PORT=$(echo $MONGODB_URL | awk -F'[/:]' '{print $5}')
DB_NAME=$(echo $MONGODB_URL | awk -F'[/:]' '{print $6}')

echo "Extracted Database Variables:"
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "DB_NAME: $DB_NAME"

# Check if the MongoDB container is up
if [ "$(docker ps -q -f name=survey_mongo_1)" ]; then
    echo "MongoDB container is up."
else
    echo "MongoDB container is not running."
    exit 1
fi

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
until docker exec survey_mongo_1 mongo --host $DB_HOST --port $DB_PORT --eval "print(\"waited for connection\")"; do
    sleep 1
done

echo "MongoDB is ready."

# Download the forms.json file
echo "Downloading forms.json from GitHub..."
curl -o forms.json https://raw.githubusercontent.com/ELEVATE-Project/observation-survey-projects-pwa/refs/heads/release-2.0.0/forms.json

# Modify forms.json using Node.js
echo "Modifying forms.json to add organizationId, deleted, and version fields..."
cat << 'EOF' > modify_forms.js
const fs = require('fs');

// Load the original forms.json file
const data = JSON.parse(fs.readFileSync('forms.json', 'utf8'));

// Modify each form document
const modifiedData = data.map(form => ({
    ...form,
    organizationId: 1,
    deleted: false,
    version: 0
}));

// Write the modified data to a new JSON file
fs.writeFileSync('/tmp/forms_with_orgId.json', JSON.stringify(modifiedData, null, 2));
console.log('Modified forms.json with organizationId, deleted, and version fields.');
EOF

# Run the Node.js script to modify forms.json
node modify_forms.js

# Check the contents of the modified file
echo "Checking contents of /tmp/forms_with_orgId.json:"
cat /tmp/forms_with_orgId.json

# Copy the modified JSON file into the MongoDB container
docker cp /tmp/forms_with_orgId.json survey_mongo_1:/tmp/forms_with_orgId.json

# Delete existing documents from the forms collection
echo "Deleting existing documents from the forms collection..."
docker exec survey_mongo_1 mongo --host $DB_HOST --port $DB_PORT $DB_NAME --eval 'db.forms.deleteMany({})'

# Insert new documents from modified forms.json into MongoDB
echo "Inserting new documents from modified forms.json into MongoDB..."
docker exec survey_mongo_1 mongoimport --host $DB_HOST --port $DB_PORT --db $DB_NAME --collection forms --file /tmp/forms_with_orgId.json --jsonArray

# Clean up
rm forms.json /tmp/forms_with_orgId.json
docker exec survey_mongo_1 rm /tmp/forms_with_orgId.json
rm modify_forms.js