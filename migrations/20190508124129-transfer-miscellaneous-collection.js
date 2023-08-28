module.exports = {
  async up(db) {

    global.migrationMsg = "Migrated up transfer-miscellaneous-collection file";

    if (process.env.TRANSFER_FROM_DB !== "") {

      let sourceDB = global.transferFromDb

      let configurations = await sourceDB.collection('configurations').find({}).toArray();

      await db.collection('configurations').insertMany(configurations);


      let feedback = await sourceDB.collection('feedback').find({}).toArray();

      await db.collection('feedback').insertMany(feedback);


      let reportOptions = await sourceDB.collection('reportOptions').find({}).toArray();

      await db.collection('reportOptions').insertMany(reportOptions);


      let sharedLink = await sourceDB.collection('sharedLink').find({}).toArray();

      await db.collection('sharedLink').insertMany(sharedLink);

      global.migrationMsg = "Total configurations, feedback, reportOptions and sharedLink collection."

      return
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
