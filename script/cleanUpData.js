const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

async function deleteCollectionsInBatches(mongoUrl) {
	const batchSize = 1000 // Configurable batch size
	const collectionsToDelete = [
		'programs',
		'solutions',
		'criteria',
		'criteriaQuestions',
		'frameworks',
		'observations',
		'observationSubmissions',
		'userExtension',
        'programUsers',
        'questions',
        'submissions',
        'surveys',
        'surveySubmissions',
        'userRoles'
	]

	// Validate MongoDB URL
	if (!mongoUrl) {
		console.error('Error: MongoDB URL must be provided as a command-line argument or in .env as MONGODB_URL')
		process.exit(1)
	}

	let client

	try {
		// Connect to MongoDB
		client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
		console.log('Connected to MongoDB')

		const db = client.db() // Use default database from URL

		// Get list of existing collections
		const existingCollections = new Set((await db.listCollections().toArray()).map((col) => col.name))

		// Process each collection
		for (const collectionName of collectionsToDelete) {
			// Check if collection exists
			if (!existingCollections.has(collectionName)) {
				console.log(`Collection ${collectionName} does not exist. Skipping.`)
				continue
			}

			const collection = db.collection(collectionName)

			// Count total documents in the collection
			const totalDocs = await collection.countDocuments()
			console.log(`Collection: ${collectionName}, Total documents to delete: ${totalDocs}`)

			if (totalDocs === 0) {
				console.log(`No documents found in ${collectionName}. Skipping.`)
				continue
			}

			// Delete in batches
			let deletedCount = 0
			while (deletedCount < totalDocs) {
				// Find a batch of document IDs to delete
				const batchDocs = await collection.find({}).limit(batchSize).project({ _id: 1 }).toArray()

				if (batchDocs.length === 0) {
					break // No more documents to delete
				}

				// Extract IDs for deletion
				const batchIds = batchDocs.map((doc) => doc._id)

				// Delete documents by IDs
				const batchResult = await collection.deleteMany({ _id: { $in: batchIds } })
				const batchDeleted = batchResult.deletedCount
				deletedCount += batchDeleted
				console.log(
					`Collection: ${collectionName}, Deleted ${batchDeleted} documents in this batch. Total deleted: ${deletedCount}`
				)
			}

			console.log(`Completed deletion for ${collectionName}. Total documents deleted: ${deletedCount}`)
		}

		console.log('All specified collections have been processed')
	} catch (error) {
		console.error('Error during deletion:', error.message)
		process.exit(1)
	} finally {
		if (client) {
			await client.close()
			console.log('MongoDB connection closed')
		}
	}
}

// Get MongoDB URL from command-line argument or environment variable
const mongoUrl = process.argv[2] || process.env.MONGODB_URL

// Run the script
deleteCollectionsInBatches(mongoUrl).catch((error) => {
	console.error('Script failed:', error.message)
	process.exit(1)
})
