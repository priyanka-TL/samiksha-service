module.exports = {
  async up(db) {
    let parentEntitiesMappingNotIncluded = ['parent', 'teacher', 'student', 'schoolLeader', 'smc'];

    let entityTypeDocuments = await db.collection('entityTypes').find({}).project({ name: 1 }).toArray();

    global.migrationMsg = 'Migrated up add-toBeMappedToParentEntities file';

    if (entityTypeDocuments.length > 0) {
      global.migrationMsg = 'Add toBeMappedToParentEntities flag in entityTypes.';

      await Promise.all(
        entityTypeDocuments.map(async (entityType) => {
          let toBeMappedToParentEntities = true;

          if (parentEntitiesMappingNotIncluded.includes(entityType.name)) {
            toBeMappedToParentEntities = false;
          }

          return await db.collection('entityTypes').findOneAndUpdate(
            {
              _id: entityType._id,
            },
            { $set: { toBeMappedToParentEntities: toBeMappedToParentEntities } },
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
