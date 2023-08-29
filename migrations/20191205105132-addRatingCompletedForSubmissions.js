module.exports = {
  async up(db) {
    global.migrationMsg = 'Add ratingCompletedAt field for observationSubmissions and submissions.';

    let observationSolutionDocuments = await db
      .collection('solutions')
      .find({ isRubricDriven: true, type: 'observation' })
      .project({ _id: 1 })
      .toArray();

    if (observationSolutionDocuments.length > 0) {
      await Promise.all(
        observationSolutionDocuments.map(async (solution) => {
          let allObservationSubmissionDocuments = await db
            .collection('observationSubmissions')
            .find({ solutionId: solution._id, status: 'completed' })
            .project({ _id: 1, completedDate: 1, ratingCompletedAt: 1 })
            .toArray();

          await Promise.all(
            allObservationSubmissionDocuments.map(async (observationSubmission) => {
              if (observationSubmission.completedDate && observationSubmission.completedDate != '') {
                if (!observationSubmission.ratingCompletedAt) {
                  return await db
                    .collection('observationSubmissions')
                    .update(
                      { _id: observationSubmission._id },
                      { $set: { ratingCompletedAt: observationSubmission.completedDate } },
                    );
                }
              }
            }),
          );
        }),
      );
    }

    let solutionDocuments = await db
      .collection('solutions')
      .find({ isRubricDriven: true, type: 'assessment' })
      .project({ _id: 1 })
      .toArray();

    if (solutionDocuments.length > 0) {
      await Promise.all(
        solutionDocuments.map(async (solution) => {
          let allSubmissionDocuments = await db
            .collection('submissions')
            .find({ solutionId: solution._id, status: 'completed' })
            .project({ _id: 1, completedDate: 1, ratingCompletedAt: 1 })
            .toArray();

          await Promise.all(
            allSubmissionDocuments.map(async (submission) => {
              if (submission.completedDate && submission.completedDate != '') {
                if (!submission.ratingCompletedAt) {
                  return await db
                    .collection('submissions')
                    .update({ _id: submission._id }, { $set: { ratingCompletedAt: submission.completedDate } });
                }
              }
            }),
          );
        }),
      );
    }

    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
