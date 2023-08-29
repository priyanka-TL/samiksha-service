module.exports = {
  async up(db) {
    global.migrationMsg = 'Set enableQuestionReadOut false for all solutions.';

    return await db.collection('solutions').updateMany(
      {
        type: {
          $in: ['assessment', 'observation'],
        },
      },
      { $set: { enableQuestionReadOut: false } },
    );

    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
