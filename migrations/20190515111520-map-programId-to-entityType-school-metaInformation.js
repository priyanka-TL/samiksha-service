module.exports = {
  async up(db) {
    global.migrationMsg = "Migrated up map-programId-to-entityType-school-metaInformation";

    let solutionWithEntities = await db.collection('solutions').find({}).project({ programId: 1, entities: 1 }).toArray();

    if (solutionWithEntities.length > 0) {
      
      solutionWithEntities.forEach(async (solution) => {
        await Promise.all(solution.entities.map(async (entity) => {
          return db.collection('entities').updateOne(
            { _id: entity },
            { $set: { "metaInformation.createdByProgramId": solution.programId } }
          )
        }))
      });
    }

  },

  async down(db) {

    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
