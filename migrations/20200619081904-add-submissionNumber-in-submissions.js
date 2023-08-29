module.exports = {
  async up(db) {
    global.migrationMsg = 'Add submission number index in submissions';

    await db.collection('submissions').createIndex({
      submissionNumber: 1,
    });
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
