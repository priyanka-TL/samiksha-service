module.exports = {
  async up(db) {
    global.migrationMsg = "Created index for programId and programExternalId in observations";
    await db.collection('observations').createIndex({ programId : 1 });
    await db.collection('observations').createIndex({ programExternalId : 1 });
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
