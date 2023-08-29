module.exports = {
  async up(db) {
    global.migrationMsg =
      'Add organisation information to all observations and update observationInformation to all observation submissions.';

    const defaultUserRootOrganisations = process.env.USER_DEFAULT_ROOT_ORGANISATION;
    const defaultUserOrganisations = process.env.USER_DEFAULT_ORGANISATION;
    // Update observationInformation to all observation submissions.
    let userRootOrganisations = defaultUserRootOrganisations.split(',');
    let userOrganisations = defaultUserOrganisations.split(',');

    if (userRootOrganisations.length < 1 || userOrganisations.length < 1) {
      return true;
    }

    let allObservationDocuments = await db.collection('observations').find({}).project({ createdBy: 1 }).toArray();
    let userIdsProcessed = {};

    for (
      let pointerToObservationDocuments = 0;
      pointerToObservationDocuments < allObservationDocuments.length;
      pointerToObservationDocuments++
    ) {
      const observation = allObservationDocuments[pointerToObservationDocuments];
      if (observation._id && !userIdsProcessed[observation.createdBy]) {
        await db
          .collection('observations')
          .updateMany(
            { createdBy: observation.createdBy },
            { $set: { createdFor: userOrganisations, rootOrganisations: userRootOrganisations } },
          );
        userIdsProcessed[observation.createdBy] = true;
      }
    }
    delete userIdsProcessed;

    allObservationDocuments = await db.collection('observations').find({}).project({ entities: 0 }).toArray();

    for (
      let pointerToObservationDocuments = 0;
      pointerToObservationDocuments < allObservationDocuments.length;
      pointerToObservationDocuments++
    ) {
      const observation = allObservationDocuments[pointerToObservationDocuments];
      if (observation._id) {
        const observationInformation = _.omit(observation, ['_id', 'entities', 'deleted', '__v']);
        await db
          .collection('observationSubmissions')
          .updateMany({ observationId: observation._id }, { $set: { observationInformation: observationInformation } });
      }
    }

    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
