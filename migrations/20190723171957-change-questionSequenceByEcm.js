module.exports = {
  async up(db) {

      let solutionDocuments = await db.collection('solutions').find({ questionSequenceByEcm: { $exists: true } }).project({ questionSequenceByEcm: 1, sections: 1 }).toArray();

      global.migrationMsg = "Migrated up change-questionSequenceByEcm file";

      if(solutionDocuments.length>0) {

        global.migrationMsg = "Change question sequence by ECM in solutions."

        await Promise.all(solutionDocuments.map(async (solution) => {

        if (solution.questionSequenceByEcm && solution.sections) {
          let sectionNameToCodeMap = {}
          let newquestionSequenceByEcm = {}

          Object.keys(solution.sections).forEach(sectionCode => {
            sectionNameToCodeMap[solution.sections[sectionCode]] = sectionCode
          })

          Object.keys(solution.questionSequenceByEcm).forEach(ecmCode => {
            Object.keys(solution.questionSequenceByEcm[ecmCode]).forEach(sectionName => {
              if (!newquestionSequenceByEcm[ecmCode]) newquestionSequenceByEcm[ecmCode] = {}
              if (!newquestionSequenceByEcm[ecmCode][sectionNameToCodeMap[sectionName]]) newquestionSequenceByEcm[ecmCode][sectionNameToCodeMap[sectionName]] = solution.questionSequenceByEcm[ecmCode][sectionName]
            })
          })

          return await db.collection('solutions').findOneAndUpdate({
            _id: solution._id
          }, { $set: { questionSequenceByEcm: newquestionSequenceByEcm } })
        }


        }))

    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
