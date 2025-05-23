/**
 * name : mapRolesToId.js
 * author : Saish R B
 * created-date : 23-May-2025
 * Description : Migration script to update roles with there _id
 */


const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const MONGODB_URL = 'mongodb://localhost:27017';
const DB = 'elevate-samiksha';
const tenantId = 'shikshagraha';
const entityBaseURL = 'http://localhost:5001';

const dbClient = new MongoClient(MONGODB_URL);
const request = require('request');

let ObjectId = mongoose.Types.ObjectId;

async function getSubRolesData(professional_role_id) {
  console.log(professional_role_id);

  var options = {
    method: 'GET',
    url: `${entityBaseURL}/entity-management/v1/entities/subEntityList/${professional_role_id}?type=professional_subroles`,
    headers: {
      tenantId: tenantId,
      'Content-Type': 'application/json',
    },
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response) {
      if (error) return reject(error);
      let parsedResponse = JSON.parse(response.body);

      if (parsedResponse.status !== 200) {
        return reject(error);
      }

      resolve(parsedResponse.result['data']);
    });
  });
}

async function getProfessionalRolesData() {
  var options = {
    method: 'GET',
    url: `${entityBaseURL}/entity-management/v1/entities/entityListBasedOnEntityType?entityType=professional_role`,
    headers: {
      'Content-Type': 'application/json',
      tenantId: tenantId,
    },
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response) {
      if (error) return reject(error);
      let parsedResponse = JSON.parse(response.body);

      if (parsedResponse.status !== 200) {
        return reject(error);
      }

      resolve(parsedResponse.result);
    });
  });
}

// async function getIdFromAPI(type, name) {
// 	// Replace with actual API logic
// 	try {
// 		const response = await axios.get(`${process.env.ROLE_RESOLUTION_API}/${type}?name=${encodeURIComponent(name)}`);
// 		return response.data.id; // Adapt based on your actual API response structure
// 	} catch (error) {
// 		console.error(`Failed to resolve ID for ${type} "${name}":`, error.message);
// 		return null;
// 	}
// }

async function modifyCollection(collectionName) {
  let professionalRolesData = await getProfessionalRolesData();

  await dbClient.connect();
  const db = dbClient.db(DB); // default DB from connection string
  const collection = db.collection(collectionName);

  const cursor = collection.find({
    'scope.professional_role': { $exists: true, $type: 'array' },
    'scope.professional_subroles': { $exists: true, $type: 'array' },
  });

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    const updatedScope = { ...doc.scope };

    console.log('before update', updatedScope);

    let professional_role_id_arr = [];

    if (updatedScope['professional_role'].includes('ALL') || updatedScope['professional_subroles'].includes('ALL')) {
      continue;
    }

    {
      if (
        updatedScope.hasOwnProperty('professional_role') &&
        updatedScope['professional_role'].length >= 1 &&
        !updatedScope['professional_role'].includes('ALL')
      ) {
        let currentProfessionalRole = updatedScope['professional_role'];

        let modifiedProfessionalRole = [];

        for (let professionalRoleElement of currentProfessionalRole) {
          let professionalRole = professionalRolesData.find((role) => role.externalId === professionalRoleElement);

          if (professionalRole) {
            modifiedProfessionalRole.push(professionalRole._id);
          } else {
            modifiedProfessionalRole.push(professionalRoleElement);
          }
        }

        updatedScope['professional_role'] = modifiedProfessionalRole;
        professional_role_id_arr = modifiedProfessionalRole;
      }

      if (
        updatedScope.hasOwnProperty('professional_subroles') &&
        updatedScope['professional_subroles'].length >= 1 &&
        !updatedScope['professional_subroles'].includes('ALL')
      ) {
        let currentProfessionalSubRole = updatedScope['professional_subroles'];

        let modifiedSubRole = [];

        for (let professional_role_id of professional_role_id_arr) {
          for (let subRoleElement of currentProfessionalSubRole) {
            let subRolesData = null;
            try {
              subRolesData = await getSubRolesData(professional_role_id);
            } catch (e) {
              console.log(e);
              continue;
            }

            let professionalSubRole = subRolesData.find((role) => role.externalId === subRoleElement);

            if (professionalSubRole) {
              modifiedSubRole.push(professionalSubRole._id);
            } else {
              // modifiedSubRole.push(subRoleElement)
            }
          }
        }

        updatedScope['professional_subroles'] = modifiedSubRole;
      }
    }

    console.log(updatedScope, 'updatedScope');

    await collection.updateOne({ _id: doc._id }, { $set: { scope: updatedScope } });
  }

  await dbClient.close();
  console.log(`Collection "${collectionName}" migration completed.`);
}

async function runMigration() {
  // Example call, you can call modifyCollection with different collection names
  await modifyCollection('programs');
  await modifyCollection('solutions');
}

runMigration();
