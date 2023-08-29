module.exports = {
  async up(db) {
    global.migrationMsg = 'User id index in entities';
    await db.collection('entities').createIndex({ userId: 1 });
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
