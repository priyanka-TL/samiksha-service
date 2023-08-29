module.exports = {
  async up(db) {
    global.migrationMsg = 'Set default platform roles for existing user roles';
    return await db.collection('userRoles').updateMany({}, { $set: { isAPlatformRole: false } });
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
