module.exports = {
  async up(db) {

    global.migrationMsg = "Migrated up transfer-individualEntities file";

    if (process.env.TRANSFER_FROM_DB !== "") {

      let sourceDB = global.transferFromDb

      let individualEntities = await sourceDB.collection('entities').find({}).toArray();

      if (!individualEntities.length > 0) return

      let individualEntitiesArray = new Array

      let teacherEntity = await db.collection('entityTypes').find({
        name: "teacher"
      }).toArray();

      for (let individualEntityCounter = 0; individualEntityCounter < individualEntities.length; individualEntityCounter++) {
        individualEntitiesArray.push({
          _id: individualEntities[individualEntityCounter]._id,
          userId: individualEntities[individualEntityCounter].userId,
          entityTypeId: teacherEntity[0]._id,
          entityType: "teacher",
          regsitryDetails: {},
          groups: {},
          metaInformation: _.omit(individualEntities[individualEntityCounter], [
            "_id",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "__v",
            "isDeleted"
          ]),
          updatedBy: (individualEntities[individualEntityCounter].updatedBy) ? individualEntities[individualEntityCounter].updatedBy : "INITIALIZE",
          createdBy: (individualEntities[individualEntityCounter].createdBy) ? individualEntities[individualEntityCounter].createdBy : "INITIALIZE",
          createdAt: (individualEntities[individualEntityCounter].createdAt) ? individualEntities[individualEntityCounter].createdAt : new Date,
          updatedAt: (individualEntities[individualEntityCounter].updatedAt) ? individualEntities[individualEntityCounter].updatedAt : new Date,
          isDeleted: false
        })
      }

      global.migrationMsg = "Total individuals transferred - " + individualEntities.length

      return await db.collection('entities').insertMany(individualEntitiesArray);
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
