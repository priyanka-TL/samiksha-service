module.exports = {
  async up(db) {
    let defaultObservation = await db
      .collection('forms')
      .find({ name: 'defaultObservationMetaForm' })
      .project({ name: 1, value: 1 })
      .toArray();
    global.migrationMsg = 'Migrated up make-observation-description-textarea file';

    if (defaultObservation.length > 0) {
      global.migrationMsg = 'Change input type of description to text area.';

      const descriptionFieldIndex = defaultObservation[0].value.findIndex((field) => field.field === 'description');

      if (descriptionFieldIndex >= 0) {
        defaultObservation[0].value[descriptionFieldIndex].input = 'textarea';
        return await db
          .collection('forms')
          .updateOne({ name: 'defaultObservationMetaForm' }, { $set: { value: defaultObservation[0].value } });
      }
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
