module.exports = {
  async up(db) {

      global.migrationMsg = "Migrated up rename-type-to-value-in-entityType file";

      let entityTypeDocuments = await db.collection('entityTypes').find({}).project({ types: 1 }).toArray();

      if(entityTypeDocuments.length> 0) {

        global.migrationMsg = "Rename type to value in types array entityType collection"
        
        await Promise.all(entityTypeDocuments.map(async entityType => {
          let types = entityType.types;
          if (types) {
            types.forEach(type => {
              if (type.type) {
                type.value = type.type
                delete type.type
              }
            })
            db.collection('entityTypes').updateOne({ _id: entityType._id }, { $set: { types: types } });
          }
        }));
      }
    },

  async down(db) {

  }
};
