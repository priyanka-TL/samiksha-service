/**
 * name : fixOrgIdsFromCollections.js
 * author : Saish R B
 * created-date : 27-May-2025
 * Description : Migration script to update orgIds to scope
 */

require('dotenv').config({ path: '../.env' });
const { MongoClient } = require('mongodb');
const MONGODB_URL = process.env.MONGODB_URL;
const DB = process.env.DB;

const dbClient = new MongoClient(MONGODB_URL);

async function modifyCollection(collectionName) {
    console.log(`Starting migration for collection: ${collectionName}`);
  await dbClient.connect();
  const db = dbClient.db(DB); // default DB from connection string
  const collection = db.collection(collectionName);

  const cursor = collection.find({
    "scope.orgIds": { $exists: true, $type: 'array' },
  });

  while (await cursor.hasNext()) {
    console.log(`processing for collection: ${collectionName}`);
    const doc = await cursor.next();

    console.log(`Processing document with _id: ${doc._id}`);

    const orgIds = doc.scope.orgIds;

    if (orgIds.length === 0 || !orgIds || orgIds.includes('ALL')) {
      console.log(`Skipping document with _id: ${doc._id} as it contains 'ALL' or is empty.`);
      continue;
    }

    let dataToBeUpdated = {}
    if (['programs', 'solutions'].includes(collectionName)) {
      //neeed to update the scope
      let currentScope = doc.scope || [];

      currentScope['organizations'] = orgIds;
      delete currentScope['orgIds'];
      console.log(`Updating document with _id: ${doc._id} with scope: ${currentScope}`);
      await collection.updateOne({ _id: doc._id }, { $unset: { orgIds: '' }, $set: { scope:currentScope } });
    }

   break;
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
