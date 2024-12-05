const { MongoClient } = require("mongodb");

require("dotenv").config({ path: "../.env" });

const newDbUrl = "mongodb://10.148.0.43:27017"; // Old DB URL
const oldDbUrl = "mongodb://localhost:27017"; // New DB URL

const newDbName = "elevate-samiksha"; // Replace with your old DB name
const oldDbName = "innovationdb1733375463965"; // Replace with your new DB name

async function compareDatabases() {
  const oldClient = new MongoClient(oldDbUrl);
  const newClient = new MongoClient(newDbUrl);

  try {
    await oldClient.connect();
    await newClient.connect();

    const oldDb = oldClient.db(oldDbName);
    const newDb = newClient.db(newDbName);

    const oldCollections = await oldDb.listCollections().toArray();
    const newCollections = await newDb.listCollections().toArray();

    const oldCollectionNames = oldCollections.map(col => col.name);
    const newCollectionNames = newCollections.map(col => col.name);

    const commonCollections = oldCollectionNames.filter(name => newCollectionNames.includes(name));

    for (const collectionName of commonCollections) {
      console.log(`Comparing collection: ${collectionName}`);

      const oldCollection = oldDb.collection(collectionName);
      const newCollection = newDb.collection(collectionName);

      const oldDocs = await oldCollection.find({}).toArray();
      const newDocs = await newCollection.find({}).toArray();

      const oldDocsMap = new Map();
      const newDocsMap = new Map();

      // Map documents by _id for quick lookup
      oldDocs.forEach(doc => oldDocsMap.set(doc._id.toString(), doc));
      newDocs.forEach(doc => newDocsMap.set(doc._id.toString(), doc));

      const missingInNew = [];
      const missingInOld = [];
      const mismatchedDocs = [];

      // Check documents from the old DB in the new DB
      for (const [id, oldDoc] of oldDocsMap) {
        const newDoc = newDocsMap.get(id);
        if (!newDoc) {
          missingInNew.push(oldDoc);
        } else if (JSON.stringify(oldDoc) !== JSON.stringify(newDoc)) {
          mismatchedDocs.push({ _id: id, oldDoc, newDoc });
        }
      }

      // Check documents from the new DB in the old DB
      for (const [id, newDoc] of newDocsMap) {
        if (!oldDocsMap.has(id)) {
          missingInOld.push(newDoc);
        }
      }

      // Log results
      if (missingInNew.length > 0) {
        console.log(`Documents missing in new DB for collection: ${collectionName}`);
        missingInNew.forEach(doc => console.log(`Missing document: ${JSON.stringify(doc, null, 2)}`));
      }

      if (missingInOld.length > 0) {
        console.log(`Documents missing in old DB for collection: ${collectionName}`);
      //  missingInOld.forEach(doc => console.log(`Missing document: ${JSON.stringify(doc, null, 2)}`));
      }

      if (mismatchedDocs.length > 0) {
        console.log(`Mismatched documents in collection: ${collectionName}`);
        mismatchedDocs.forEach(({ _id, oldDoc, newDoc }) =>
          console.log(
            `Mismatch for _id ${_id}:\nOld: ${JSON.stringify(oldDoc, null, 2)}\nNew: ${JSON.stringify(newDoc, null, 2)}`
          )
        );
      }

      if (missingInNew.length === 0 && missingInOld.length === 0 && mismatchedDocs.length === 0) {
        console.log(`Collection ${collectionName} is identical in both databases.`);
      }
    }

    console.log("Database comparison completed.");
  } catch (error) {
    console.error("Error during comparison:", error);
  } finally {
    await oldClient.close();
    await newClient.close();
  }
}

compareDatabases().catch(err => console.error("Error in main function:", err));
