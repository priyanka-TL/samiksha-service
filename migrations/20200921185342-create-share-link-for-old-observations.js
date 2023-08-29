module.exports = {
  async up(db) {
    var md5 = require('md5');

    global.migrationMsg = 'Created Shared Link For Old Observations';

    let solutions = await db
      .collection('solutions')
      .find({ type: 'observation', isReusable: false }, { author: 1 })
      .toArray();

    if (solutions.length > 0) {
      for (let pointerToSolutionsArray = 0; pointerToSolutionsArray < solutions.length; pointerToSolutionsArray++) {
        const solution = solutions[pointerToSolutionsArray];
        await db
          .collection('solutions')
          .updateOne({ _id: solution._id }, { $set: { link: md5(solution._id + '###' + solution.author) } });
      }
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
