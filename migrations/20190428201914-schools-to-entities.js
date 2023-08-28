module.exports = {
  async up(db) {

    global.migrationMsg = "Migrated up schools-to-entities file";

    if (process.env.TRANSFER_FROM_DB !== "") {

      let sourceDB = global.transferFromDb;

      let schools = await sourceDB.collection('schools').find({}).toArray();

      let schoolEntity = await db.collection('entityTypes').find({
        name: "school"
      }).toArray();

      let schoolArray = new Array;

      for (let schoolCounter = 0; schoolCounter < schools.length; schoolCounter++) {
        schools[schoolCounter].questionGroup = schools[schoolCounter].schoolTypes
        schoolArray.push({
          _id: schools[schoolCounter]._id,
          entityTypeId: schoolEntity[0]._id,
          entityType: "school",
          regsitryDetails: {},
          groups: {},
          metaInformation: _.omit(schools[schoolCounter], [
            "_id",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "__v",
            "isDeleted"
          ]),
          updatedBy: (schools[schoolCounter].updatedBy) ? schools[schoolCounter].updatedBy : "INITIALIZE",
          createdBy: (schools[schoolCounter].createdBy) ? schools[schoolCounter].createdBy : "INITIALIZE",
          createdAt: (schools[schoolCounter].createdAt) ? schools[schoolCounter].createdAt : new Date,
          updatedAt: (schools[schoolCounter].updatedAt) ? schools[schoolCounter].updatedAt : new Date,
          isDeleted: false
        })
      }

      await db.collection('entities').createIndex({ entityTypeId: 1 });

      await db.collection('entities').createIndex({ "entityType": "text" });
      global.migrationMsg = "Total schools transferred - " + schools.length;

      return await db.collection('entities').insertMany(schoolArray);

    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
