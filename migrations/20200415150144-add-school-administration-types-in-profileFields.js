module.exports = {
  async up(db) {
    global.migrationMsg = 'Add school types and administration types in school and state entity types';

    let schoolTypesForm = {
      field: 'schoolTypes',
      label: 'School types',
      value: '',
      visible: '',
      editable: '',
      options: [
        {
          value: 'primary',
          label: 'Primary schools',
        },
        {
          value: 'secondary',
          label: 'Secondary schools',
        },
        {
          value: 'middle',
          label: 'Middle schools',
        },
        {
          value: 'higherSecondary',
          label: 'Higher secondary schools',
        },
      ],
      input: 'multiselect',
    };

    let administrationsTypeForm = { ...schoolTypesForm };
    administrationsTypeForm['field'] = 'administrationTypes';
    administrationsTypeForm['label'] = 'Administration types';
    administrationsTypeForm['options'] = [
      {
        value: 'government',
        label: 'Government',
      },
      {
        value: 'municipal',
        label: 'Municipal',
      },
      {
        value: 'private',
        label: 'Private',
      },
    ];

    await db.collection('entityTypes').updateMany(
      {
        name: {
          $in: ['school', 'state'],
        },
      },
      {
        $addToSet: {
          profileFields: {
            $each: ['schoolTypes', 'administrationTypes'],
          },
          profileForm: {
            $each: [schoolTypesForm, administrationsTypeForm],
          },
        },
      },
    );

    return;
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
