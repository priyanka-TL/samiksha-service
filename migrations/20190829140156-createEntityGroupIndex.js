module.exports = {
  async up(db) {
    let allEntityTypes = await db.collection('entityTypes').find({}).toArray();
    global.migrationMsg = 'Migrated up createEntityGroupIndex file';

    if (allEntityTypes.length > 0) {
      global.migrationMsg = 'Add entity type index.';
      for (
        let pointerToAllEntityTypes = 0;
        pointerToAllEntityTypes < allEntityTypes.length;
        pointerToAllEntityTypes++
      ) {
        await db
          .collection('entities')
          .createIndex(
            { ['groups.' + allEntityTypes[pointerToAllEntityTypes].name]: 1 },
            {
              partialFilterExpression: {
                ['groups.' + allEntityTypes[pointerToAllEntityTypes].name]: { $exists: true },
              },
              background: 1,
            },
          );
      }

      return;
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
