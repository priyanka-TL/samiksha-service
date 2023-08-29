module.exports = {
  async up(db) {
    global.migrationMsg = 'Add a isAPrivateProgram field in existing program and assessment solutions';

    await db.collection('programs').updateMany(
      {
        isAPrivateProgram: { $exists: false },
      },
      {
        $set: {
          isAPrivateProgram: false,
        },
      },
    );

    await db.collection('solutions').updateMany(
      {
        type: 'assessment',
        isAPrivateProgram: { $exists: false },
      },
      {
        $set: {
          isAPrivateProgram: false,
        },
      },
    );
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
