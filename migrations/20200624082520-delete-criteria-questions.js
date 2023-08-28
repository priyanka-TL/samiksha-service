module.exports = {
  async up(db) {
    global.migrationMsg = "Drop criteria questions";
    return await db.collection('criteriaQuestions').drop();
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
