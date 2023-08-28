module.exports = {
  async up(db) {

    let solutions = await db.collection('solutions').find({}).project({ programExternalId: 1 }).toArray();

    global.migrationMsg = "Migrated up add-registry-to-solutions file";

    if (solutions.length>0) {
      solutions.forEach(async (solution) => {
        await db.collection('solutions').findOneAndUpdate(
          {
            _id: solution._id
          },
          {
            $set: { "registry": (solution.programExternalId == "PROGID01") ? ["parent"] : ["schoolLeader", "teacher"] }
          }
        )
      });

      global.migrationMsg = "Registry added to solutions"

      return true
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
