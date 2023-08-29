module.exports = {
  async up(db) {
    global.migrationMsg = 'Added is common in existing static links and dropped value index';
    await db.collection('staticLinks').dropIndex({ value: 1 });
    await db.collection('staticLinks').createIndex({ value: 1 });
    return await db.collection('staticLinks').updateMany({}, { $set: { isCommon: true } });
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
