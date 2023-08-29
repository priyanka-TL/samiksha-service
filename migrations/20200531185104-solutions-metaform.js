module.exports = {
  async up(db) {
    global.migrationMsg = 'Add solution metaform information';

    let metaForm = [
      {
        field: 'name',
        label: 'Name',
        value: '',
        visible: true,
        editable: true,
        input: 'text',
        validation: {
          required: true,
        },
        min: '',
        max: '',
      },
      {
        field: 'description',
        label: 'Description',
        value: '',
        visible: true,
        editable: true,
        input: 'text',
        validation: {
          required: true,
        },
        min: '',
        max: '',
      },
    ];

    let solutionsType = ['institutional', 'individual'];

    let result = [];

    for (let type = 0; type < solutionsType.length; type++) {
      let form = {};

      if (solutionsType[type] === 'institutional') {
        form['name'] = 'defaultInstitutionalMetaForm';
      } else {
        form['name'] = 'defaultIndividualMetaForm';
      }

      form['value'] = metaForm;

      result.push(form);
    }

    await db.collection('forms').insertMany(result);

    return;
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
