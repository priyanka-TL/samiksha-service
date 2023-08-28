module.exports = {
  async up(db) {
      
      global.migrationMsg = "Migrated up create-observations-from-solutions file";
      
      let solutionDocuments = await db.collection('solutions').find({
        type: "assessment",
        subType: {
          $in: [
            "observation",
            "cro"
          ]
        },
        isReusable: false
      }).toArray();


      await db.collection('observationSubmissions').createIndex({ observationId: 1 })

      await db.collection('observationSubmissions').createIndex({ createdBy: 1 })

      await db.collection('observationSubmissions').createIndex({ entityId: 1 })

      await db.collection('observationSubmissions').createIndex({ entityExternalId: 1 })

      await db.collection('observationSubmissions').createIndex({ solutionId: 1 })

      await db.collection('observationSubmissions').createIndex({ solutionExternalId: 1 })

      await db.collection('observationSubmissions').createIndex({ entityTypeId: 1 })

      await db.collection('observationSubmissions').createIndex({ "entityType": "text" })

      if(solutionDocuments.length > 0) {

        global.migrationMsg = "Create observations from solutions."
        await Promise.all(solutionDocuments.map(async (solutionDocument) => {

          let entityAssessorDocuments = await db.collection('entityAssessors').find({
            programId: solutionDocument.programId,
            solutionId: solutionDocument._id,
            entityTypeId: solutionDocument.entityTypeId
          }).toArray();

          let parentSolutionDocument = await db.collection('solutions').find({
           _id: solutionDocument.parentSolutionId
          }).toArray();

          await Promise.all(entityAssessorDocuments.map(async (entityAssessor) => {

            let observationId = await db.collection('observations').insertOne({
              "entities": entityAssessor.entities,
              "deleted": false,
              "name": parentSolutionDocument[0].name + " By - " + entityAssessor.name,
              "description": parentSolutionDocument[0].description,
              "status": "published",
              "solutionId": parentSolutionDocument[0]._id,
              "solutionExternalId": parentSolutionDocument[0].externalId,
              "frameworkId": parentSolutionDocument[0].frameworkId,
              "frameworkExternalId": parentSolutionDocument[0].frameworkExternalId,
              "entityTypeId": parentSolutionDocument[0].entityTypeId,
              "entityType": parentSolutionDocument[0].entityType,
              "createdBy": entityAssessor.userId,
              "updatedAt": entityAssessor.updatedAt,
              "createdAt": entityAssessor.createdAt,
              "startDate": solutionDocument.startDate,
              "endDate": solutionDocument.endDate,
              "__v": 0
            });

            await db.collection('entityAssessors').deleteOne({ _id: entityAssessor._id })

            if (observationId.insertedId) {

              let submissionIds = await db.collection('submissions').find({
                programId: solutionDocument.programId,
                solutionId: solutionDocument._id,
                entityId: {
                  $in: entityAssessor.entities
                }
              }).project({ _id: 1 }).toArray();

              let chunkOfSubmissionsIdsDocument = _.chunk(submissionIds, 10)

              let oldSubmissionDocumentsArray = new Array

              for (let pointerTosubmissionIdDocument = 0; pointerTosubmissionIdDocument < chunkOfSubmissionsIdsDocument.length; pointerTosubmissionIdDocument++) {

                let fetchSubmissionIds = new Array
                chunkOfSubmissionsIdsDocument[pointerTosubmissionIdDocument].forEach(submissionId => {
                  fetchSubmissionIds.push(submissionId._id)
                })

                oldSubmissionDocumentsArray = await db.collection('submissions').find(
                  {
                    _id: {
                     $in: fetchSubmissionIds
                    }
                  }
                ).toArray();

                await Promise.all(oldSubmissionDocumentsArray.map(async (eachSubmissionDocument) => {

                  try {

                    eachSubmissionDocument.entityExternalId = eachSubmissionDocument.entityInformation.externalId

                    eachSubmissionDocument.createdBy = entityAssessor.userId
                    eachSubmissionDocument.observationId = observationId.insertedId

                    eachSubmissionDocument.solutionId = parentSolutionDocument[0]._id
                    eachSubmissionDocument.solutionExternalId = parentSolutionDocument[0].externalId

                    eachSubmissionDocument.entityTypeId = parentSolutionDocument[0].entityTypeId
                    eachSubmissionDocument.entityType = parentSolutionDocument[0].entityType

                    let observationSubmissionId = await db.collection('observationSubmissions').insertOne(_.omit(eachSubmissionDocument, [
                      "assessors",
                      "parentInterviewResponsesStatus",
                      "programExternalId",
                      "programId",
                      "programInformation"
                    ]));

                    if (observationSubmissionId.insertedId) {
                      await db.collection('submissions').deleteOne({ _id: eachSubmissionDocument._id })
                    }

                  } catch (error) {
                    console.log(eachSubmissionDocument._id)
                    console.log(error)
                  }

                  return true

                }))

            }

          }

        }))

        await db.collection('solutions').findOneAndUpdate({
          _id: parentSolutionDocument[0]._id
        }, {
          $set: {
            type: "observation",
            subType: parentSolutionDocument[0].entityType
          }
          })

        await db.collection('solutions').deleteOne({ _id: solutionDocument._id })

        await db.collection('programs').deleteOne({ _id: solutionDocument.programId })

        }))

      return true

      }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};

