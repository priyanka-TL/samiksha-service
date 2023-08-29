module.exports = {
  async up(db) {
    global.migrationMsg = 'Add default poll question form';

    let defaultPollQuestionForm = [
      {
        field: 'question',
        label: 'Question',
        value: '',
        visible: true,
        editable: true,
        validation: {
          required: true,
        },
        input: 'text',
      },
    ];

    await db.collection('forms').insertOne({
      name: 'defaultPollQuestionForm',
      value: defaultPollQuestionForm,
    });
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
