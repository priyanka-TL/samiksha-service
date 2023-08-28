module.exports = {
  async up(db) {

    global.migrationMsg = "Migrated up transfer-insights file";

    if (process.env.TRANSFER_FROM_DB !== "") {

      let sourceDB = global.transferFromDb

      let insightIds = await sourceDB.collection('insights').find({}).project({ _id: 1 }).toArray();

      let solutionDocuments = await db.collection('solutions').find({}).project({ entityTypeId: 1, entityType: 1 }).toArray();
      let solutionDocumentMap = {}

      solutionDocuments.forEach(solution => {
        solutionDocumentMap[solution._id.toString()] = {
          entityTypeId: solution.entityTypeId,
          entityType: solution.entityType
        }
      });

      let chunkOfInsightIdsDocument = _.chunk(insightIds, 10)

      let oldInsightsDocumentsArray = new Array

      await db.collection('submissions').createIndex({ programId: 1 })

      await db.collection('submissions').createIndex({ programExternalId: 1 })

      await db.collection('insights').createIndex({ programId: 1 })

      await db.collection('insights').createIndex({ programExternalId: 1 })

      await db.collection('insights').createIndex({ entityId: 1 })

      await db.collection('insights').createIndex({ entityExternalId: 1 })

      await db.collection('insights').createIndex({ solutionId: 1 })

      await db.collection('insights').createIndex({ solutionExternalId: 1 })

      await db.collection('insights').createIndex({ entityTypeId: 1 })

      await db.collection('insights').createIndex({ "entityType": "text" })

      for (let pointerToInsightsIdDocument = 0; pointerToInsightsIdDocument < chunkOfInsightIdsDocument.length; pointerToInsightsIdDocument++) {

        let fetchInsightsIds = new Array
        chunkOfInsightIdsDocument[pointerToInsightsIdDocument].forEach(insightId => {
          fetchInsightsIds.push(insightId._id)
        })

        oldInsightsDocumentsArray = await sourceDB.collection('insights').find(
          {
            _id: {
              $in: fetchInsightsIds
            }
          }
        ).toArray();

        await Promise.all(oldInsightsDocumentsArray.map(async (eachInsightDocument) => {

          eachInsightDocument.isDeleted = false
          eachInsightDocument.entityId = (eachInsightDocument.entityId) ? eachInsightDocument.entityId : eachInsightDocument.schoolId
          eachInsightDocument.entityExternalId = (eachInsightDocument.entityExternalId) ? eachInsightDocument.entityExternalId : eachInsightDocument.schoolExternalId

          eachInsightDocument.solutionExternalId = eachInsightDocument.evaluationFrameworkExternalId
          eachInsightDocument.solutionId = eachInsightDocument.evaluationFrameworkId

          eachInsightDocument.entityName = (eachInsightDocument.entityName) ? eachInsightDocument.entityName : eachInsightDocument.schoolName

          eachInsightDocument.entityTypeId = solutionDocumentMap[eachInsightDocument.evaluationFrameworkId.toString()].entityTypeId
          eachInsightDocument.entityType = solutionDocumentMap[eachInsightDocument.evaluationFrameworkId.toString()].entityType

          await db.collection('insights').insertOne(_.omit(eachInsightDocument, [
            "schoolName",
            "schoolExternalId",
            "schoolId",
            "evaluationFrameworkExternalId",
            "evaluationFrameworkId",
            "deleted"
          ]));

          return true

        }))

      }

      global.migrationMsg = "Total insights transferred - " + insightIds.length

      return true
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
