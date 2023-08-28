module.exports = {
  async up(db) {

    global.migrationMsg = "Migrated up transfer-schoolAssessors file";

    if (process.env.TRANSFER_FROM_DB !== "") {
      let sourceDB = global.transferFromDb

      let schoolAssessors = await sourceDB.collection('schoolAssessors').find({}).toArray();

      let schoolAssessorsArray = new Array

      let schoolEntity = await db.collection('entityTypes').find({
        name: "school"
      }).toArray();

      let solutions = await db.collection('solutions').find({}).project({ programId: 1, externalId: 1 }).toArray();

      const solutionsData = solutions.reduce(
        (ac, solution) => ({ ...ac, [solution.programId.toString()]: { solutionId: solution._id } }), {})

      for (let schoolAssessorCounter = 0; schoolAssessorCounter < schoolAssessors.length; schoolAssessorCounter++) {

        if (!schoolAssessors[schoolAssessorCounter].userId || schoolAssessors[schoolAssessorCounter].userId == "") continue

        schoolAssessors[schoolAssessorCounter].entities = schoolAssessors[schoolAssessorCounter].schools
        schoolAssessors[schoolAssessorCounter].solutionId = (solutionsData[schoolAssessors[schoolAssessorCounter].programId.toString()] && solutionsData[schoolAssessors[schoolAssessorCounter].programId.toString()].solutionId) ? solutionsData[schoolAssessors[schoolAssessorCounter].programId.toString()].solutionId : null
        schoolAssessors[schoolAssessorCounter].entityTypeId = schoolEntity[0]._id
        schoolAssessors[schoolAssessorCounter].entityType = schoolEntity[0].name
        schoolAssessorsArray.push(_.omit(schoolAssessors[schoolAssessorCounter], [
          "schools"
        ]))
      }

      global.migrationMsg = "Total school assessors transferred - " + schoolAssessors.length

      return await db.collection('entityAssessors').insertMany(schoolAssessorsArray);
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
