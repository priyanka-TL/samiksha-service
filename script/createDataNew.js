const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: "../.env" });

const url = process.env.MONGODB_URL_TO_CREATE;
const surveyDB = process.env.SURVEY_DB + Date.now();

// Define the output folder
const outputFolder = path.join(__dirname, "json_data");

async function insertData(collectionName, filePath, curretDB = surveyDB) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log(`[${new Date().toISOString()}] Connected to MongoDB for collection: ${collectionName}`);

    const db = client.db(curretDB);
    const collection = db.collection(collectionName);

    // Read data from the JSON file
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (!data || data.length === 0) {
      console.log(`[${new Date().toISOString()}] No data found in ${filePath}`);
      return;
    }

    // Convert Extended JSON fields
    const transformedData = data.map(doc => convertFromExtendedJson(doc));

    const result = await collection.insertMany(transformedData);
    console.log(`[${new Date().toISOString()}] Inserted ${result.insertedCount} documents into ${collectionName}`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error inserting data into ${collectionName}:`, err);
  } finally {
    await client.close();
  }
}

/**
 * Converts MongoDB Extended JSON to native types.
 * Handles $oid and $date recursively.
 */
function convertFromExtendedJson(value) {
  if (value && typeof value === "object") {
    if ("$oid" in value) {
      return new ObjectId(value.$oid);
    }
    if ("$date" in value) {
      return new Date(value.$date);
    }
    // Process nested objects/arrays
    for (const key in value) {
      value[key] = convertFromExtendedJson(value[key]);
    }
  } else if (Array.isArray(value)) {
    return value.map(item => convertFromExtendedJson(item));
  }
  return value;
}

async function main() {
  try {
    // Read all JSON files dynamically from the output folder
    const files = fs.readdirSync(outputFolder).filter(file => file.endsWith(".json"));

    for (const file of files) {
      const collectionName = path.basename(file, ".json");
      const filePath = path.join(outputFolder, file);

      await insertData(collectionName, filePath);
    }

    console.log(`[${new Date().toISOString()}] Data population completed.`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error during main execution:`, err);
  }
}

main().catch(err => console.error(`[${new Date().toISOString()}] Main function error:`, err));
