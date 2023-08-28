module.exports = {
  async up(db) {

    global.migrationMsg = "Migrated up transfer-appAccessTokens file";

    if (process.env.TRANSFER_FROM_DB !== "") {

      let sourceDB = global.transferFromDb

      let oldAppAccessTokens = await sourceDB.collection('appAccessToken').find({}).toArray();

      let oldAppAccessTokensArray = new Array

      let solutionDocuments = await db.collection('solutions').find({}).project({ externalId: 1, programExternalId: 1, programId: 1 }).toArray();
      let solutionDocumentMap = {}

      solutionDocuments.forEach(solution => {
        solutionDocumentMap[solution.programId.toString()] = {
          solutionId: solution._id,
          solutionExternalId: solution.externalId,
          programId: solution.programId
        }
      });

      for (let pointerToOldAppAccessToken = 0; pointerToOldAppAccessToken < oldAppAccessTokens.length; pointerToOldAppAccessToken++) {

        oldAppAccessTokens[pointerToOldAppAccessToken].entityId = (oldAppAccessTokens[pointerToOldAppAccessToken].entityId) ? ObjectID(oldAppAccessTokens[pointerToOldAppAccessToken].entityId) : ObjectID(oldAppAccessTokens[pointerToOldAppAccessToken].schoolId)
        oldAppAccessTokens[pointerToOldAppAccessToken].entityFieldValue = (oldAppAccessTokens[pointerToOldAppAccessToken].entityExternalId) ? oldAppAccessTokens[pointerToOldAppAccessToken].entityExternalId : oldAppAccessTokens[pointerToOldAppAccessToken].schoolExternalId
        oldAppAccessTokens[pointerToOldAppAccessToken].entityField = "externalId"

        oldAppAccessTokens[pointerToOldAppAccessToken].solutionId = solutionDocumentMap[oldAppAccessTokens[pointerToOldAppAccessToken].programId].solutionId
        oldAppAccessTokens[pointerToOldAppAccessToken].programId = solutionDocumentMap[oldAppAccessTokens[pointerToOldAppAccessToken].programId].programId
        oldAppAccessTokens[pointerToOldAppAccessToken].solutionExternalId = solutionDocumentMap[oldAppAccessTokens[pointerToOldAppAccessToken].programId].solutionExternalId


        oldAppAccessTokensArray.push(_.omit(oldAppAccessTokens[pointerToOldAppAccessToken], [
          "schoolExternalId",
          "schoolId"
        ]))

      }

      global.migrationMsg = "Total app access tokens transferred - " + oldAppAccessTokens.length

      return await db.collection('appAccessToken').insertMany(oldAppAccessTokensArray);

    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
