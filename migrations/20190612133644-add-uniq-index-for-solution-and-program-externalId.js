module.exports = {
  async up(db) {
    global.migrationMsg = 'Add uniq index for program and solution externalId.';
    await db.collection('programs').createIndex({ externalId: 1 }, { unique: true });
    await db.collection('solutions').createIndex({ externalId: 1 }, { unique: true });
  },

  async down(db) {},
};
