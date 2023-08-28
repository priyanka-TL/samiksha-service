module.exports = {
  async up(db) {

    global.migrationMsg = "Migrated up teachers-to-entities file";

    if (process.env.TRANSFER_FROM_DB !== "") {

      let sourceDB = global.transferFromDb;
      let teachers = await sourceDB.collection('teacherRegistry').find({}).toArray();

      let schoolToTeachers = {}

      let teachersArray = new Array

      let teacherEntity = await db.collection('entityTypes').find({
        name: "teacher"
      }).toArray();

      for (let teachersCounter = 0; teachersCounter < teachers.length; teachersCounter++) {

        teachers[teachersCounter].createdByProgramId = ObjectID(teachers[teachersCounter].programId)
        if (schoolToTeachers[teachers[teachersCounter].schoolId]) {
          schoolToTeachers[teachers[teachersCounter].schoolId].teachers.push(teachers[teachersCounter]._id)
        } else {
          schoolToTeachers[teachers[teachersCounter].schoolId] = {
            teachers: [
              teachers[teachersCounter]._id
            ]
          }
        }

        teachersArray.push({
          _id: teachers[teachersCounter]._id,
          entityTypeId: teacherEntity[0]._id,
          entityType: "teacher",
          regsitryDetails: {},
          groups: {},
          metaInformation: _.omit(teachers[teachersCounter], [
            "_id",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "__v",
            "isDeleted",
            "programId",
            "schoolId"
          ]),
          updatedBy: (teachers[teachersCounter].updatedBy) ? teachers[teachersCounter].updatedBy : "INITIALIZE",
          createdBy: (teachers[teachersCounter].createdBy) ? teachers[teachersCounter].createdBy : "INITIALIZE",
          createdAt: (teachers[teachersCounter].createdAt) ? teachers[teachersCounter].createdAt : new Date,
          updatedAt: (teachers[teachersCounter].updatedAt) ? teachers[teachersCounter].updatedAt : new Date,
          isDeleted: false
        })
      }

      global.migrationMsg = "Total teachers transferred - " + teachers.length

      await Promise.all(Object.keys(schoolToTeachers).map(async (schoolId) => {
        await db.collection('entities').findOneAndUpdate(
          {
            _id: ObjectID(schoolId)
          },
          {
            $set: { "groups.teacher": schoolToTeachers[schoolId].teachers }
          }
        )
      }))

      return await db.collection('entities').insertMany(teachersArray);
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
