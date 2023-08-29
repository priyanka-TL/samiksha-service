module.exports = {
  async up(db) {
    global.migrationMsg = 'Update entity registryDetails in submissions collection';
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});

    let submissions = await db
      .collection('submissions')
      .find({ entityId: { $exists: true } })
      .project({ _id: 1 })
      .toArray();

    let chunkOfSubmissions = _.chunk(submissions, 100);

    for (let submissions = 0; submissions < chunkOfSubmissions.length; submissions++) {
      let submissionId = chunkOfSubmissions[submissions].map((submission) => {
        return submission._id;
      });

      let submissionDocuments = await db
        .collection('submissions')
        .find({
          _id: { $in: submissionId },
        })
        .project({
          entityId: 1,
        })
        .toArray();

      let entityId = submissionDocuments.map((submissionData) => {
        return submissionData.entityId;
      });

      let entityDocuments = await db
        .collection('entities')
        .find({
          _id: { $in: entityId },
          registryDetails: { $exists: true },
        })
        .project({
          registryDetails: 1,
        })
        .toArray();

      if (entityDocuments.length > 0) {
        let entityRegistryMap = _.keyBy(entityDocuments, '_id');

        for (let submission = 0; submission < submissionDocuments.length; submission++) {
          if (
            entityRegistryMap[submissionDocuments[submission].entityId.toString()] &&
            Object.keys(entityRegistryMap[submissionDocuments[submission].entityId.toString()].registryDetails).length >
              0
          ) {
            await db.collection('submissions').findOneAndUpdate(
              { _id: submissionDocuments[submission]._id },
              {
                $set: {
                  'entityInformation.registryDetails':
                    entityRegistryMap[submissionDocuments[submission].entityId.toString()].registryDetails,
                },
              },
              {
                upsert: true,
              },
            );
          }
        }
      }
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
