module.exports = {
  async up(db) {
    global.migrationMsg = "Add index to observations."

    await db.collection('observations').createIndex({ createdBy: 1 })
    await db.collection('observations').createIndex({ solutionId: 1 })
    await db.collection('observations').createIndex({ solutionExternalId: 1 })
    await db.collection('observations').createIndex({ status: 1 })
    await db.collection('observations').createIndex({ entityTypeId: 1 })

  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
