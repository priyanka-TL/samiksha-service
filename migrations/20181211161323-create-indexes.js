module.exports = {
  async up(db) {
    global.migrationMsg = 'Migrated up create-indexes file';

    // frameworks
    await db.collection('frameworks').createIndex({ _id: 1 });

    // criteria
    await db.collection('criteria').createIndex({ _id: 1 });

    // questions
    await db.collection('questions').createIndex({ externalId: 1 }, { unique: true });

    // sharedLinks
    await db.collection('sharedLinks').createIndex({ _id: 1 });

    // feedback

    await db.collection('feedback').createIndex({ _id: 1 });

    // configurations

    await db.collection('configurations').createIndex({ _id: 1 });

    // reportOptions

    await db.collection('reportOptions').createIndex({ _id: 1 });

    // Submissions
    await db.collection('submissions').createIndex({ entityId: 1 });
    await db.collection('submissions').createIndex({ entityExternalId: 1 });
    await db.collection('submissions').createIndex({ solutionId: 1 });
    await db.collection('submissions').createIndex({ solutionExternalId: 1 });
    await db.collection('submissions').createIndex({ entityTypeId: 1 });
    await db.collection('submissions').createIndex({ programId: 1 });
    await db.collection('submissions').createIndex({ programExternalId: 1 });
    await db.collection('submissions').createIndex({ status: 1 });
    await db.collection('submissions').createIndex({ 'feedback.submissionDate': 1 });
    await db.collection('submissions').createIndex({ entityType: 'text' });

    // insights

    await db.collection('insights').createIndex({ programId: 1 });
    await db.collection('insights').createIndex({ entityId: 1 });
    await db.collection('insights').createIndex({ entityExternalId: 1 });
    await db.collection('insights').createIndex({ solutionId: 1 });
    await db.collection('insights').createIndex({ solutionExternalId: 1 });
    await db.collection('insights').createIndex({ entityTypeId: 1 });
    await db.collection('insights').createIndex({ entityType: 'text' });
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
