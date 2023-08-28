module.exports = {
  async up(db) {
    global.migrationMsg = "Created Index for submissions and observationSubmissions."
    await db.collection('submissions').createIndex({ status: 1 })
    await db.collection('observationSubmissions').createIndex({ status: 1 })
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
