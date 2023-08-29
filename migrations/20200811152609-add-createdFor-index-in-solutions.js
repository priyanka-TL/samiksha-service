module.exports = {
  async up(db) {
    global.migrationMsg = 'Added created for index in solutions';
    await db.collection('solutions').createIndex({ createdFor: 1 });
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
