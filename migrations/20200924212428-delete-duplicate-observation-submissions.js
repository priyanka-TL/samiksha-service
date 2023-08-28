module.exports = {
  async up(db) {

    global.migrationMsg = "Delete duplicate observation submissions";

    let observationSubmissionDocuments = await db.collection('observationSubmissions').find({ status: "blocked" }).project({ evidences: 1, status: 1, evidencesStatus: 1 }).toArray();

    if (observationSubmissionDocuments.length > 0) {

      let chunkOfSubmissionDocuments = _.chunk(observationSubmissionDocuments, 10);

      for (
        let pointerToSubmissionDocument = 0;
        pointerToSubmissionDocument < chunkOfSubmissionDocuments.length;
        pointerToSubmissionDocument++
      ) {
      
        chunkOfSubmissionDocuments[pointerToSubmissionDocument].map(async submissionDocument => {
        submissionDocument.status = "completed";

        Object.keys(submissionDocument.evidences).forEach(evidence => {
          submissionDocument.evidences[evidence].hasConflicts = false;

          if (submissionDocument.evidences[evidence].submissions.length > 0) {
            submissionDocument.evidences[evidence].submissions.splice(1, 1);
          }
        });

        submissionDocument.evidencesStatus.forEach(async evidenceStatus => {
          evidenceStatus.hasConflicts = false;

          if (evidenceStatus.submissions.length > 0) {
            delete evidenceStatus.submissions.splice(1, 1);
          }
        })

        await db.collection('observationSubmissions').updateOne({ _id: submissionDocument._id }, { $set: { evidences: submissionDocument.evidences, status: submissionDocument.status, evidencesStatus: submissionDocument.evidencesStatus } })
      
       })
      }
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
