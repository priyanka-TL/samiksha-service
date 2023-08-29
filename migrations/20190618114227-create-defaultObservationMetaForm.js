module.exports = {
  async up(db) {
    global.migrationMsg = 'Created default observation meta.';

    let defaultObservationMeta = {
      name: 'defaultObservationMetaForm',
      value: [
        {
          field: 'name',
          label: 'Title',
          value: '',
          visible: true,
          editable: true,
          input: 'text',
          validation: {
            required: true,
          },
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
        },
        {
          field: 'startDate',
          label: 'Start Date',
          value: '',
          visible: true,
          editable: true,
          input: 'date',
          validation: {
            required: true,
          },
        },
        {
          field: 'endDate',
          label: 'End Date',
          value: '',
          visible: true,
          editable: true,
          input: 'date',
          validation: {
            required: true,
          },
        },
        {
          field: 'status',
          label: 'Status',
          value: 'draft',
          visible: false,
          editable: true,
          input: 'radio',
          validation: {
            required: true,
          },
          options: [
            {
              value: 'published',
              label: 'Published',
            },
            {
              value: 'draft',
              label: 'Published',
            },
            {
              value: 'completed',
              label: 'Completed',
            },
          ],
        },
      ],
    };

    await db.collection('forms').createIndex({ name: 1 });

    return await db.collection('forms').insertMany([defaultObservationMeta]);
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
