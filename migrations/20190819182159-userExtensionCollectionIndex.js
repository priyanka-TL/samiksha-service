module.exports = {
  async up(db) {
    global.migrationMsg = 'Add necessary index for userExtensions collection.';

    await db.collection('userExtension').createIndex({ externalId: 1 }, { unique: true });

    await db.collection('userExtension').createIndex({ userId: 1 }, { unique: true });

    return await db.collection('userExtension').createIndex({ status: 1 });
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
