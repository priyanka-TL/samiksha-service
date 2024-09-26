const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017'; // MongoDB URL
const dbName = 'test-sample-db2';
const surveyData = require('./data.js');

const observationData = require('./data2.js');

async function insertData(collectionName, dataFile) {
    const client = new MongoClient(url);

    try {
        // Connect to MongoDB
        await client.connect();
        console.log(`Connected to MongoDB for ${collectionName}`);

        const db = client.db(dbName);
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
    await insertData('programs', dataToBeInserted.programData);
    await insertData('solutions',dataToBeInserted.solutionData);
    await insertData('survey', dataToBeInserted.surveysData);
    await insertData('criteria',dataToBeInserted.criteriaData);
    await insertData('criteriaQuestions',dataToBeInserted.criteriaQuestionsData);
    await insertData('questions',dataToBeInserted.questionsData);
    await insertData('frameworks',dataToBeInserted.frameworkData);
    await insertData('observationSubmissions',dataToBeInserted.observationSubmissionData);
    await insertData('observations',dataToBeInserted.observationData);

}

main({dataToBeInserted:surveyData}).then(()=>{
    console.log('survey data populated successfully.')
}).catch(console.error);
main({dataToBeInserted:observationData}).then(()=>{
    console.log('Observation data populated successfully.')
}).catch(console.error);





