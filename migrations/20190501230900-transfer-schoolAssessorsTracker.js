module.exports = {
  async up(db) {
    global.migrationMsg = 'Migrated up transfer-schoolAssessorsTracker file';

    if (process.env.TRANSFER_FROM_DB !== '') {
      let sourceDB = global.transferFromDb;

      let schoolAssessors = await sourceDB.collection('assessorSchoolTrackers').find({}).toArray();

      let schoolAssessorsArray = new Array();

      let schoolEntity = await db
        .collection('entityTypes')
        .find({
          name: 'school',
        })
        .toArray();

      let solutions = await db.collection('solutions').find({}).project({ programId: 1, externalId: 1 }).toArray();

      const solutionsData = solutions.reduce(
        (ac, solution) => ({ ...ac, [solution.programId.toString()]: { solutionId: solution._id } }),
        {},
      );

      let assessors = await db.collection('entityAssessors').find({}).project({ userId: 1 }).toArray();

      const assessorsData = assessors.reduce((ac, assessor) => ({ ...ac, [assessor.userId]: assessor._id }), {});

      for (let schoolAssessorCounter = 0; schoolAssessorCounter < schoolAssessors.length; schoolAssessorCounter++) {
        if (
          !schoolAssessors[schoolAssessorCounter].assessorId ||
          schoolAssessors[schoolAssessorCounter].assessorId == ''
        )
          continue;

        schoolAssessors[schoolAssessorCounter].actionObject = schoolAssessors[schoolAssessorCounter].actionObject.map(
          function (el) {
            return ObjectID(el);
          },
        );
        schoolAssessors[schoolAssessorCounter].updatedData = schoolAssessors[schoolAssessorCounter].updatedData.map(
          function (el) {
            return ObjectID(el);
          },
        );
        schoolAssessors[schoolAssessorCounter].assessorUserId = schoolAssessors[schoolAssessorCounter].assessorId;
        schoolAssessors[schoolAssessorCounter].assessorId =
          assessorsData[schoolAssessors[schoolAssessorCounter].assessorId];
        schoolAssessors[schoolAssessorCounter].solutionId =
          solutionsData[schoolAssessors[schoolAssessorCounter].programId.toString()] &&
          solutionsData[schoolAssessors[schoolAssessorCounter].programId.toString()].solutionId
            ? solutionsData[schoolAssessors[schoolAssessorCounter].programId.toString()].solutionId
            : null;
        schoolAssessors[schoolAssessorCounter].entityTypeId = schoolEntity[0]._id;
        schoolAssessors[schoolAssessorCounter].entityType = schoolEntity[0].name;
        schoolAssessorsArray.push(schoolAssessors[schoolAssessorCounter]);
      }

      global.migrationMsg = 'Total school assessors trackers transferred - ' + schoolAssessors.length;

      return await db.collection('entityAssessorsTrackers').insertMany(schoolAssessorsArray);
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
