module.exports = {
  async up(db) {
    global.migrationMsg = "Migrated up add-isActive-to-ecms file";
    
    let solutionDocuments = await db.collection('solutions').find({evidenceMethods :{$exists : true}}).project({evidenceMethods: 1}).toArray();

    if(solutionDocuments.length >0) {
      global.migrationMsg = "Added isActive flag to ecms in all solutions."
      
      await Promise.all(solutionDocuments.map(async (solution) => {

      if (solution.evidenceMethods) {
        let newEvidenceMethods = {}

        Object.keys(solution.evidenceMethods).forEach(ecmCode => {
          newEvidenceMethods[ecmCode] = _.merge(solution.evidenceMethods[ecmCode],{isActive : true})
        })

        return await db.collection('solutions').findOneAndUpdate({
          _id: solution._id
        }, { $set: {evidenceMethods: newEvidenceMethods}})

      }

      }))

    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  }
},

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
