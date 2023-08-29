module.exports = {
  async up(db) {
    global.migrationMsg = 'Add submissionNumber to existing observations submissions.';

    await db.collection('observationSubmissions').createIndex({ submissionNumber: 1 });

    return await db.collection('observationSubmissions').updateMany({}, { $set: { submissionNumber: 1 } });
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
