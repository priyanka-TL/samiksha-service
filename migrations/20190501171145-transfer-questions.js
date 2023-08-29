module.exports = {
  async up(db) {
    global.migrationMsg = 'Migrated up transfer-questions file';

    if (process.env.TRANSFER_FROM_DB !== '') {
      let sourceDB = global.transferFromDb;
      let questions = await sourceDB.collection('questions').find({}).toArray();

      await db.collection('questions').insertMany(questions);

      global.migrationMsg = 'Total questions transferred - ' + questions.length;

      return;
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
