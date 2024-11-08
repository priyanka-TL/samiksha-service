#!/bin/bash

clean_object_id() {
    local object_id="$1"

    # Use parameter expansion to remove unwanted characters
    cleaned_id="${object_id//ObjectId(/}"
    cleaned_id="${cleaned_id//)/}"
    cleaned_id="${cleaned_id//\'/}"

    echo "$cleaned_id"
}


MONGO_HOST=survey_mongo_1
MONGO_PORT=27017

CONFIGURATIONS_COLLECTION="configurations"

CONFIGURATIONS_DOCUMENT=$(cat <<EOF
{
    "code" : "keysAllowedForTargeting",
    "meta" : {
        "profileKeys" : [
            "state", "district", "school", "block", "cluster",
            "board", "class", "roles", "entities", "entityTypeId",
            "entityType", "subject", "medium"
        ]
    }
}
EOF
)

echo "Configurations data being added to $CONFIGURATIONS_COLLECTION collection into database...."

# Insert CONFIGURATION_ID using docker exec
CONFIGURATION_ID=$(docker exec -it survey_mongo_1 mongo --host "$MONGO_HOST" --port "$MONGO_PORT" --quiet --eval "
    var doc = $CONFIGURATIONS_DOCUMENT;
    var result = db.getSiblingDB('elevate-samiksha').$CONFIGURATIONS_COLLECTION.insertOne(doc);
    if (result.insertedId) {
        print(result.insertedId);
    } else {
        throw new Error('Insert failed');
    }
")


CONFIGURATION_ID=$(clean_object_id "$CONFIGURATION_ID")
echo "Configurations ID: $CONFIGURATION_ID"
