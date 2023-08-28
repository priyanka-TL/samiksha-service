module.exports = {
  async up(db) {
    global.migrationMsg = "Add criteria level report key in solutions";
    await db.collection('solutions').updateMany({"scoringSystem": "pointsBasedScoring"}, {$set: {criteriaLevelReport: false}});
    await db.collection('solutions').updateMany({"scoringSystem": {$exists:true,$nin : ["pointsBasedScoring",null]}}, {$set: {criteriaLevelReport: true}});
    await db.collection('observationSubmissions').updateMany({"scoringSystem": "pointsBasedScoring"}, {$set: {criteriaLevelReport: false}});
    await db.collection('observationSubmissions').updateMany({"scoringSystem": {$exists:true,$nin : ["pointsBasedScoring",null]}}, {$set: {criteriaLevelReport: true}});
    return;
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
