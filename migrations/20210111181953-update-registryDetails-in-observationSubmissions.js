module.exports = {
  async up(db) {
    global.migrationMsg = 'Update entity registryDetails in observationSubmissions';
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});

    let observationSubmissions = await db
      .collection('observationSubmissions')
      .find({ entityId: { $exists: true } })
      .project({ _id: 1 })
      .toArray();

    let chunkOfObservationSubmissions = _.chunk(observationSubmissions, 100);

    for (
      let observationSubmissions = 0;
      observationSubmissions < chunkOfObservationSubmissions.length;
      observationSubmissions++
    ) {
      let submissionId = chunkOfObservationSubmissions[observationSubmissions].map((submission) => {
        return submission._id;
      });

      let submissionDocuments = await db
        .collection('observationSubmissions')
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
            await db.collection('observationSubmissions').findOneAndUpdate(
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
