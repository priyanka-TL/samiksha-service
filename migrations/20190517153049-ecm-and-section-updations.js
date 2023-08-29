module.exports = {
  async up(db) {
    global.migrationMsg = 'Migrated up ecm-and-section-updation';
    if (process.env.TRANSFER_FROM_DB !== '') {
      let solutionDocuments = await db
        .collection('solutions')
        .find({})
        .project({ evidenceMethods: 1, sections: 1 })
        .toArray();

      if (solutionDocuments.length > 0) {
        global.migrationMsg = 'Put all ECM and Section Code in solutions.';
        let sectionCodes = {};

        await Promise.all(
          solutionDocuments.map(async (solution) => {
            let newEvidenceMethods = {};
            Object.keys(solution.evidenceMethods).forEach((evidenceMethod) => {
              delete solution.evidenceMethods[evidenceMethod].startTime;
              delete solution.evidenceMethods[evidenceMethod].endTime;
              delete solution.evidenceMethods[evidenceMethod].isSubmitted;
              newEvidenceMethods[evidenceMethod] = solution.evidenceMethods[evidenceMethod];
              newEvidenceMethods[evidenceMethod].notApplicable = false;
              newEvidenceMethods[evidenceMethod].canBeNotAllowed = true;
              newEvidenceMethods[evidenceMethod].remarks = '';
            });

            Object.keys(solution.sections).forEach((section) => {
              sectionCodes[solution.sections[section]] = section;
            });

            return await db.collection('solutions').findOneAndUpdate(
              {
                _id: solution._id,
              },
              { $set: { evidenceMethods: newEvidenceMethods } },
            );
          }),
        );

        let criteriaDocuments = await db.collection('criteria').find({}).project({ evidences: 1 }).toArray();

        await Promise.all(
          criteriaDocuments.map(async (criteria) => {
            let newEvidences = new Array();
            criteria.evidences.forEach((evidenceMethod) => {
              let eachEvidenceMethod = {
                code: evidenceMethod.externalId,
              };
              eachEvidenceMethod.sections = new Array();
              evidenceMethod.sections.forEach((section) => {
                eachEvidenceMethod.sections.push({
                  code: sectionCodes[section.name],
                  questions: section.questions,
                });
              });
              newEvidences.push(eachEvidenceMethod);
            });

            return await db.collection('criteria').findOneAndUpdate(
              {
                _id: criteria._id,
              },
              { $set: { evidences: newEvidences } },
            );
          }),
        );

        return true;
      }
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
