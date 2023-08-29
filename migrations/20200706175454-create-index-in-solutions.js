module.exports = {
  async up(db) {
    global.migrationMsg = 'create indexes of name,description,status,isReusable,keywords in solutions';
    await db.collection('solutions').createIndex({ isReusable: 1 });
    await db.collection('solutions').createIndex({ status: 1 });
    await db.collection('solutions').createIndex(
      {
        name: 'text',
        description: 'text',
        keywords: 'text',
      },
      {
        language_override: 'dummy',
        weights: {
          name: 10,
          description: 5,
        },
      },
    );
    return;
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
