const { ObjectId } = require('mongodb');


let districtId = new ObjectId();

let entityType = [

    {
        "_id": new ObjectId(),
        "name": "state",
        "toBeMappedToParentEntities": true,
        "immediateChildrenEntityType": [
          "district"
        ],
        "isDeleted": false
      },
      {
        "_id": new ObjectId(),
        "name": "district",
        "toBeMappedToParentEntities": true,
        "immediateChildrenEntityType": [
          "block"
        ],
        "isDeleted": false
      }
]

let entities = [
    {
        "_id": new ObjectId(),
        "name": "Karnataka",
        "entityType": "state",
        "entityTypeId":entityType[0]._id,
        "userId": "1",
        "metaInformation": {
          "externalId": "KR001",
          "name": "Karnataka"
        },
        "childHierarchyPath": [],
        "groups": {
          "district": [
            districtId
          ]
        }
      },
      {
        "_id": districtId,
        "name": "Bangalore",
        "entityType": "district",
        "entityTypeId": entityType[1]._id,
        "userId": "1",
        "metaInformation": {
          "externalId": "BN001",
          "name": "Bangalore"
        },
        "childHierarchyPath": [],
        "groups": {}
      }
]

let userRoleExtension = [

    {
        "_id": new ObjectId(),
        "status": "ACTIVE",
        "createdBy": "SYSTEM",
        "updatedBy": "SYSTEM",
        "deleted": false,
        "userRoleId": "8",
        "title": "State Education Officer",
        "entityTypes": [
          {
            "entityType": "state",
            "entityTypeId": entityType[0]._id
          }
        ],
        "updatedAt": new Date("2024-09-09T09:31:47.135Z"),
        "createdAt": new Date("2024-09-09T09:31:47.135Z"),
        "__v": 0
      }

]

module.exports = {
    entities,
    entityType,
    userRoleExtension
}