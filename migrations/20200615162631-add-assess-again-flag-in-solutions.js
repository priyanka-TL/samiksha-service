module.exports = {
  async up(db) {
    global.migrationMsg = 'Add allowMultipleAssessemts flag in solutions';

    await db.collection('solutions').updateMany(
      {
        type: 'assessment',
      },
      {
        $set: {
          allowMultipleAssessemts: false,
        },
      },
    );
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
