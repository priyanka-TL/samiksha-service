const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");
const fs = require("fs");

(async () => {
    const sourceUri = "mongodb://10.148.0.43:27017";
    const sourceDbName = "elevate-samiksha";

  const sourceClient = new MongoClient(sourceUri);

  try {
    await sourceClient.connect();
    const sourceDb = sourceClient.db(sourceDbName);

    const collections = await sourceDb.listCollections().toArray();
    const outputDir = path.join(__dirname, "json_data");

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    for (const collection of collections) {
      const collectionName = collection.name;

      // Fetch all documents from the source collection
      const docs = await sourceDb.collection(collectionName).find({}).toArray();

      if (docs.length > 0) {
        // Convert documents to Extended JSON format
        const extendedJsonDocs = docs.map(doc => convertToExtendedJson(doc));

        // Save the documents into a JSON file
        const outputPath = path.join(outputDir, `${collectionName}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(extendedJsonDocs, null, 2));
        console.log(`Exported collection: ${collectionName} to ${outputPath}`);
      }
    }

    console.log("Database export completed.");
  } catch (error) {
    console.error("Error during export:", error);
  } finally {
    await sourceClient.close();
  }

  /**
   * Converts MongoDB documents to Extended JSON format.
   * Handles ObjectId and Date fields recursively.
   */
  function convertToExtendedJson(value) {
    if (value instanceof ObjectId) {
      return { $oid: value.toHexString() };
    }
    if (value instanceof Date) {
      return { $date: value.toISOString() };
    }
    if (Array.isArray(value)) {
      return value.map(item => convertToExtendedJson(item));
    }
    if (value && typeof value === "object") {
      const transformed = {};
      for (const key in value) {
        transformed[key] = convertToExtendedJson(value[key]);
      }
      return transformed;
    }
    return value;
  }
})();
