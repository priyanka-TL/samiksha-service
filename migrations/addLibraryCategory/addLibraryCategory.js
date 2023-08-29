/**
 * name : updateUserProfileInObservationAndSubmissions.js
 * author : Priyanka Pradeep
 * created-date : 10-Nov-2022
 * Description : Migration script for update userProfile in observation
 */

const path = require('path');
let rootPath = path.join(__dirname, '../../');
require('dotenv').config({ path: rootPath + '/.env' });

let _ = require('lodash');
let url = process.env.MONGODB_URL;
let dbName = process.env.DB;
var MongoClient = require('mongodb').MongoClient;

var fs = require('fs');

(async () => {
  let connection = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let db = connection.db(dbName);

  try {
    let categories = [
      {
        name: 'Individual Assessments',
        externalId: 'individual',
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: 'SYSTEM',
        createdBy: 'SYSTEM',
        icon: 'individualAssessments.png',
        isDeleted: false,
        isVisible: true,
        status: 'active',
      },
      {
        name: 'Institutional Assessments',
        externalId: 'institutional',
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: 'SYSTEM',
        createdBy: 'SYSTEM',
        icon: 'institutionalAssessments.png',
        isDeleted: false,
        isVisible: true,
        status: 'active',
      },
      {
        name: 'Observation Solutions',
        externalId: 'observation',
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: 'SYSTEM',
        createdBy: 'SYSTEM',
        icon: 'observationSolutions.png',
        isDeleted: false,
        isVisible: true,
        status: 'active',
      },
      {
        name: 'Drafts',
        externalId: 'drafts',
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: 'SYSTEM',
        createdBy: 'SYSTEM',
        icon: 'drafts.png',
        isDeleted: false,
        isVisible: true,
        status: 'active',
      },
    ];
    let entityType = await db.collection('libraryCategories').insertMany(categories);
    await db.collection('libraryCategories').createIndex({ externalId: 1 });

    console.log('Inserted libraryCategories : ', entityType);
    console.log('completed');
    connection.close();
  } catch (error) {
    console.log(error);
  }
})().catch((err) => console.error(err));
