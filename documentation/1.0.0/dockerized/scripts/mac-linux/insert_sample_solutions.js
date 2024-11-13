const { MongoClient } = require('mongodb');
console.log(process.env.MONGODB_URL ,"this is mongoURL")

const url = process.env.MONGODB_URL // MongoDB URL
const dbName = 'elevate-samiksha';
const dbName2 = 'elevate-entity';
const surveyData = require('./survey_sampleData.js');
const entityData = require('./entity_sampleData.js')
const observationData = require('./observation_sampleData.js');

async function insertData(collectionName, dataFile,curretDB = dbName) {
    const client = new MongoClient(url);

    try {
        // Connect to MongoDB
        await client.connect();
        console.log(`Connected to MongoDB for ${collectionName}`);

        const db = client.db(curretDB);
        const collection = db.collection(collectionName);

        // Read the data from the file
        const data = dataFile

        if(!data){
            await client.close();
            return;
        }

        const result = await collection.insertMany(data);
        //console.log(`Inserted ${result.insertedCount} documents into ${collectionName}`);
    } finally {
        await client.close();
    }
}

async function main({dataToBeInserted}) {


    await insertData('entities', dataToBeInserted.entities,dbName2);
    await insertData('entityTypes',dataToBeInserted.entityType,dbName2);
    await insertData('userRoleExtension', dataToBeInserted.userRoleExtension,dbName2);

    await insertData('programs', dataToBeInserted.programData);
    await insertData('solutions',dataToBeInserted.solutionData);
    await insertData('survey', dataToBeInserted.surveysData);
    await insertData('criteria',dataToBeInserted.criteriaData);
    await insertData('criteriaQuestions',dataToBeInserted.criteriaQuestionsData);
    await insertData('questions',dataToBeInserted.questionsData);
    await insertData('frameworks',dataToBeInserted.frameworkData);
    await insertData('observationSubmissions',dataToBeInserted.observationSubmissionData);
    await insertData('observations',dataToBeInserted.observationData);
    await insertData('configurations', dataToBeInserted.configurations);


}

main({dataToBeInserted:entityData}).then(()=>{
    console.log('survey data populated successfully.')
}).catch(console.error);
main({dataToBeInserted:surveyData}).then(()=>{
    console.log('survey data populated successfully.')
}).catch(console.error);
main({dataToBeInserted:observationData}).then(()=>{
    console.log('Observation data populated successfully.')
}).catch(console.error);





