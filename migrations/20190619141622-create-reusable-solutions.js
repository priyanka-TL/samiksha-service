module.exports = {
  async up(db) {
    let solutionDocuments = await db.collection('solutions').find({}).toArray();
    global.migrationMsg = 'Migrated up create-reusable-solutions file';

    if (solutionDocuments.length > 0) {
      global.migrationMsg = 'Create reusable solutions.';

      await Promise.all(
        solutionDocuments.map(async (solutionDocument) => {
          if (solutionDocument.isReusable == false) {
            solutionDocument.isReusable = true;
            solutionDocument.externalId = solutionDocument.externalId + '-TEMPLATE';

            let baseSolutionId = await db
              .collection('solutions')
              .insertOne(
                _.omit(solutionDocument, [
                  '_id',
                  'roles',
                  'entities',
                  'programId',
                  'programExternalId',
                  'programName',
                  'programDescription',
                  'startDate',
                  'endDate',
                ]),
              );

            if (baseSolutionId.insertedId) {
              return await db.collection('solutions').findOneAndUpdate(
                {
                  _id: solutionDocument._id,
                },
                {
                  $set: {
                    parentId: baseSolutionId.insertedId,
                    isReusable: false,
                  },
                },
              );
            }
          }
        }),
      );

      await db.collection('solutions').updateMany({}, { $rename: { parentId: 'parentSolutionId' } });

      return true;
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
