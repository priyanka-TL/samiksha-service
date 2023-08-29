module.exports = {
  async up(db) {
    global.migrationMsg = 'Modified question validation field';

    await db.collection('questions').updateMany(
      {
        'validation.required': 'true',
      },
      { $set: { 'validation.required': true } },
    );

    await db.collection('questions').updateMany(
      {
        'validation.required': 'false',
      },
      { $set: { 'validation.required': false } },
    );

    await db.collection('questions').updateMany(
      {
        file: { $ne: '' },
        'file.required': 'true',
      },
      { $set: { 'file.required': true } },
    );

    await db.collection('questions').updateMany(
      {
        file: { $ne: '' },
        'file.required': 'false',
      },
      { $set: { 'file.required': false } },
    );
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
