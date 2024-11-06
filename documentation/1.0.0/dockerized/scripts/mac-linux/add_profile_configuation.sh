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

# USER_EXTENSION_DOCUMENT=$(cat <<EOF
# {
#     "status" : "ACTIVE",
#     "createdBy" : "SYSTEM",
#     "updatedBy" : "SYSTEM",
#     "deleted" : false,
#     "userRoleId" : "8",
#     "title" : "State Education Officer",
#     "entityTypes" : [ 
#         {
#             "entityType" : "state",
#             "entityTypeId" : $ENTITY_TYPE_ID,
#         }
#     ],
#     "updatedAt" : "2024-09-09T09:31:47.135Z",
#     "createdAt" : "2024-09-09T09:31:47.135Z",
#     "__v" : 0
# }
# EOF
# )

# echo "user data being added to userRoleExtension collection in $ENTITY_SERVICE_DB_NAME database...."
# # Insert SOLUTION_ID using docker exec
# USER_EXTENSION_ID=$(docker exec -it project_mongo_1 mongo --host "$MONGO_HOST" --port "$MONGO_PORT" --quiet --eval "
#     var doc = $USER_EXTENSION_DOCUMENT;
#     var result = db.getSiblingDB('$ENTITY_SERVICE_DB_NAME').userRoleExtension.insertOne(doc);
#     if (result.insertedId) {
#         print(result.insertedId);
#     } else {
#         throw new Error('Insert failed');
#     }
# ")

# USER_EXTENSION_ID=$(clean_object_id "$USER_EXTENSION_ID")
# echo "UserExtention ID: $USER_EXTENSION_ID"

echo "Configurations data being added to $CONFIGURATIONS_COLLECTION collection in $PROJECT_DB_NAME database...."

# Insert CONFIGURATION_ID using docker exec
CONFIGURATION_ID=$(docker exec -it project_mongo_1 mongo --host "$MONGO_HOST" --port "$MONGO_PORT" --quiet --eval "
    var doc = $CONFIGURATIONS_DOCUMENT;
    var result = db.getSiblingDB('$PROJECT_DB_NAME').$CONFIGURATIONS_COLLECTION.insertOne(doc);
    if (result.insertedId) {
        print(result.insertedId);
    } else {
        throw new Error('Insert failed');
    }
")


CONFIGURATION_ID=$(clean_object_id "$CONFIGURATION_ID")
echo "Configurations ID: $CONFIGURATION_ID"