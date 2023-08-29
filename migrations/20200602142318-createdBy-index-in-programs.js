module.exports = {
  async up(db) {
    global.migrationMsg = 'Added created by index in programs';
    await db.collection('programs').createIndex({ createdBy: 1 });
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
