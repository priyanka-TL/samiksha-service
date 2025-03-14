require('dotenv').config({ path: '../.env' })
const { MongoClient } = require('mongodb')
const sourceClient = new MongoClient(process.env.SOURCE_MONGODB_URL, { useUnifiedTopology: true })
const destClient = new MongoClient(process.env.DEST_MONGODB_URL, { useUnifiedTopology: true })
const BATCH_SIZE = 500
let allCollectionsFromSourceDB = []

async function fetchCollectionNamesFromSourceDB() {
	const sourceDB = sourceClient.db()
	const allCollections = await sourceDB.listCollections().toArray()

	await Promise.all(allCollections)
	allCollectionsFromSourceDB = allCollections.map((collection) => {
		return collection.name
	})
}

async function migrateCollection(collectionName, transformFunc) {
	const sourceDB = sourceClient.db()
	const destDB = destClient.db()

	const sourceCollection = sourceDB.collection(collectionName)
	const destCollection = destDB.collection(collectionName)

	let offset = 0
	let batch

	while (true) {
		batch = await sourceCollection.find({}).skip(offset).limit(BATCH_SIZE).toArray()
		if (batch.length === 0) break

		const transformedBatch = await Promise.all(batch.map(transformFunc))

		try {
			await destCollection.insertMany(transformedBatch, { ordered: false })
			console.log(`Migrated ${batch.length} documents from ${collectionName}`)
		} catch (error) {
			console.error(`Error inserting batch in ${collectionName}: ${error.message}`)
		}

		offset += BATCH_SIZE
	}
}

// function to transform documents from solutions collection
const transformSolutions = async (doc) => {
	if (doc.baseProjectDetails && doc.baseProjectDetails.length > 0 && doc.baseProjectDetails[0]._id) {
		doc['projectTemplateId'] = doc.baseProjectDetails[0]._id
	}
	if ('scope' in doc && Object.keys(doc.scope).length > 0) {
		if ('entityType' in doc.scope && doc.scope.entityType !== '') {
			if ('entities' in doc.scope && doc.scope.entities.length > 0) {
				doc.scope[`${doc.scope.entityType}`] = []
				doc.scope.entities.map((entity) => {
					doc.scope[`${doc.scope.entityType}`].push(entity.toString())
				})
				delete doc.scope.entities
			}
		}
		if ('roles' in doc.scope && doc.scope.roles.length > 0) {
			let roles = doc.scope.roles.map((role) => {
				return role.code
			})
			doc.scope.roles = roles
		}
	}
	return doc
}

// function to transform documents from programs collection
const transformPrograms = async (doc) => {
	if ('scope' in doc && Object.keys(doc.scope).length > 0) {
		if ('entityType' in doc.scope && doc.scope.entityType !== '') {
			if ('entities' in doc.scope && doc.scope.entities.length > 0) {
				doc.scope[`${doc.scope.entityType}`] = []
				doc.scope.entities.map((entity) => {
					doc.scope[`${doc.scope.entityType}`].push(entity)
				})
				delete doc.scope.entities
			}
		}
		if ('roles' in doc.scope && doc.scope.roles.length > 0) {
			let roles = doc.scope.roles.map((role) => {
				return role.code
			})
			doc.scope.roles = roles
		}
	}
	return doc
}

// function to transform documents from projectAttributes collection
const transformProjectAttributes = (doc) => {
	if (doc.options && doc.options.length > 0) {
		doc['entities'] = doc.options
	}
	return doc
}

// function to transform documents from forms collection
const transformForms = async (doc) => {
	if (doc.name && doc.name != '') {
		doc['type'] = doc.name
	}
	if (doc.value && doc.value.length > 0) {
		doc['data'] = doc.value
		doc.data.forEach((ele) => {
			if (ele.field && ele.field != '') {
				ele['name'] = ele.field
			}
			if (ele.input && ele.input != '') {
				ele['type'] = ele.input
			}
			if (ele.validation && Object.keys(ele.validation).length > 0) {
				ele['validators'] = {}
				Object.keys(ele.validation).map((key) => {
					if (key == 'regex') {
						ele['validators']['pattern'] = ele.validation[`${key}`]
					} else {
						ele['validators'][`${key}`] = ele.validation[`${key}`]
					}
				})
			}
		})
	}

	return doc
}

const transformNotNeeded = (doc) => {
	return doc
}


// Not yet completed, once the testing is done, we can conclude on this
// const transformProjects = (doc) => {

// }

async function runMigration() {
	await sourceClient.connect()
	await destClient.connect()
	await fetchCollectionNamesFromSourceDB()
	for (const collection of allCollectionsFromSourceDB) {
		if (collection === 'solutions') {
			await migrateCollection(collection, transformSolutions)
		}
		// if (collection === 'projectAttributes') {
		// 	await migrateCollection(collection, transformProjectAttributes)
		// }
		if (collection === 'programs') {
			await migrateCollection(collection, transformPrograms)
		}
		if (collection === 'forms') {
			await migrateCollection(collection, transformForms)
		}
		await migrateCollection(collection, transformNotNeeded)
	}
	await sourceClient.close()
	await destClient.close()
	console.log('Migration Completed!')
}

runMigration()
