module.exports = {
  async up(db) {
    global.migrationMsg = "Set title value for all observation submissions."

    let allSubmissionDocuments = await db.collection('observationSubmissions').find({submissionNumber: {$exists : true}}).project({_id: 1, submissionNumber :1}).toArray();
    
    for (let pointerToSubmissionDocuments = 0; pointerToSubmissionDocuments < allSubmissionDocuments.length; pointerToSubmissionDocuments++) {
      if(allSubmissionDocuments[pointerToSubmissionDocuments]._id) {
        if(allSubmissionDocuments[pointerToSubmissionDocuments].submissionNumber && allSubmissionDocuments[pointerToSubmissionDocuments].submissionNumber > 0) {
          await db.collection('observationSubmissions').findOneAndUpdate(
            {_id : allSubmissionDocuments[pointerToSubmissionDocuments]._id},
            {$set: {title: "Observation "+allSubmissionDocuments[pointerToSubmissionDocuments].submissionNumber} }
          );
        }
      }
    }

  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
