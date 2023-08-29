module.exports = {
  async up(db) {
    global.migrationMsg = 'Add isAPrivateProgram and submission number for each assessment submissions';

    await db.collection('submissions').updateMany(
      {},
      {
        $set: {
          isAPrivateProgram: false,
          submissionNumber: 1,
          title: 'Assessment 1',
        },
      },
    );

    return;
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
