module.exports = {
  async up(db) {
    global.migrationMsg = 'Migrated up transfer-individualEntityAssessors file';

    if (process.env.TRANSFER_FROM_DB !== '') {
      let sourceDB = global.transferFromDb;

      let entityAssessors = await sourceDB.collection('entityAssessors').find({}).toArray();

      if (!entityAssessors.length > 0) return;

      let entityAssessorsArray = new Array();

      let teacherEntity = await db
        .collection('entityTypes')
        .find({
          name: 'teacher',
        })
        .toArray();

      let solutions = await db.collection('solutions').find({}).project({ programId: 1, externalId: 1 }).toArray();

      const solutionsData = solutions.reduce(
        (ac, solution) => ({ ...ac, [solution.programId.toString()]: { solutionId: solution._id } }),
        {},
      );

      for (let entityAssessorCounter = 0; entityAssessorCounter < entityAssessors.length; entityAssessorCounter++) {
        let entityIdOfUser = await db
          .collection('entities')
          .find({ userId: entityAssessors[entityAssessorCounter].userId })
          .toArray();

        entityAssessors[entityAssessorCounter].solutionId =
          solutionsData[entityAssessors[entityAssessorCounter].programId.toString()] &&
          solutionsData[entityAssessors[entityAssessorCounter].programId.toString()].solutionId
            ? solutionsData[entityAssessors[entityAssessorCounter].programId.toString()].solutionId
            : null;
        entityAssessors[entityAssessorCounter].entityTypeId = teacherEntity[0]._id;
        entityAssessors[entityAssessorCounter].entityType = teacherEntity[0].name;
        entityAssessors[entityAssessorCounter].entities = [entityIdOfUser[0]._id];
        entityAssessorsArray.push(entityAssessors[entityAssessorCounter]);
      }

      global.migrationMsg = 'Total entity assessors transferred - ' + entityAssessors.length;

      return await db.collection('entityAssessors').insertMany(entityAssessorsArray);
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
