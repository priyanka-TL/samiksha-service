module.exports = {
  async up(db) {
    global.migrationMsg = "Add submissions completedDate to index."

    // Create completedDate index for Submissions
    await db.collection('submissions').createIndex({ completedDate: 1 });

    // Create completedDate index for Observation Submissions
    await db.collection('observationSubmissions').createIndex({ completedDate: 1 });

    // Add completed date for submission documents.

    let allSubmissionDocuments = await db.collection('submissions').find({status:"completed",completedDate : {$exists:false}}).project({_id: 1}).toArray();
    
    for (let pointerToSubmissionDocuments = 0; pointerToSubmissionDocuments < allSubmissionDocuments.length; pointerToSubmissionDocuments++) {
      const submission = allSubmissionDocuments[pointerToSubmissionDocuments];
      if(submission._id) {
        const submissionDoc = await db.collection('submissions').find({_id:submission._id}).project({updatedAt: 1}).toArray();
        if(submissionDoc[0].updatedAt) {
          await db.collection('submissions').updateOne({_id:submissionDoc[0]._id}, { $set: {completedDate: submissionDoc[0].updatedAt}});
        }
      }
    }


    // Add completed date for observation submission documents.

    let allObservationSubmissionDocuments = await db.collection('observationSubmissions').find({status:"completed",completedDate : {$exists:false}}).project({_id: 1}).toArray();
    
    for (let pointerToObservationSubmissionDocuments = 0; pointerToObservationSubmissionDocuments < allObservationSubmissionDocuments.length; pointerToObservationSubmissionDocuments++) {
      const observationSubmission = allObservationSubmissionDocuments[pointerToObservationSubmissionDocuments];
      if(observationSubmission._id) {
        const observationSubmissionDoc = await db.collection('observationSubmissions').find({_id:observationSubmission._id}).project({updatedAt: 1}).toArray();
        if(observationSubmissionDoc[0].updatedAt) {
          await db.collection('observationSubmissions').updateOne({_id:observationSubmissionDoc[0]._id}, { $set: {completedDate: observationSubmissionDoc[0].updatedAt}});
        }
      }
    }

    return true;

  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
