module.exports = {
  async up(db) {
    let entityTypesDocuments = await db.collection('entityTypes').find({}).project({ name: 1 }).toArray();
    global.migrationMsg = 'Migrated up add-observableEntityType file';

    if (entityTypesDocuments.length > 0) {
      global.migrationMsg = 'Add isObservable flag to solutions.';

      let observableEntities = {
        classroom: 1,
        teacher: 1,
      };

      await Promise.all(
        entityTypesDocuments.map(async (entityTypeDocument) => {
          let isObservable = false;

          if (observableEntities[entityTypeDocument.name]) {
            isObservable = true;
          }

          return await db.collection('entityTypes').findOneAndUpdate(
            {
              _id: entityTypeDocument._id,
            },
            { $set: { isObservable: isObservable } },
          );
        }),
      );

      return true;
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
