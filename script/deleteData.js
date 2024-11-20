require('dotenv').config({ path: '../.env' });
const { MongoClient } = require('mongodb');


// Fetch MongoDB URL and collections to delete from environment variables
const URL = process.env.MONGODB_URL;
const collectionsToDelete = process.env.COLLECTIONS_TO_DELETE.split(',');

// Function to delete specified collections in MongoDB
async function deleteCollections() {
// Initialize the MongoDB client with the connection URL
  const client = new MongoClient(URL);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Access the default database specified in the connection URL
    const db = client.db();

    // Loop through each collection name in the array
    for (const collectionName of collectionsToDelete) {
      const collection = db.collection(collectionName);
      const exists = await collection.countDocuments();

      if (exists > 0) {
        // Drop the collection if it contains documents
        await db.dropCollection(collectionName);
        console.log(`Deleted collection: ${collectionName}`);
      } else {
        console.log(`Collection not found or already empty: ${collectionName}`);
      }
    }
  } 
  
  catch (error) {
    console.error('Error deleting collections:', error);
  } finally {
    await client.close();
    console.log('Connection to MongoDB closed');
  }
}

deleteCollections();
