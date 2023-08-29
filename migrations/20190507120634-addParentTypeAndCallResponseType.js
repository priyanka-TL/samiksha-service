module.exports = {
  async up(db) {
    let parentEntityType = await db.collection('entityTypes').find({ name: 'parent' }).toArray();

    global.migrationMsg = 'Migrated up addParentTypeAndCallResponseType file';

    if (parentEntityType.length > 0) {
      await db.collection('entityTypes').findOneAndUpdate(
        {
          _id: parentEntityType[0]._id,
        },
        {
          $set: {
            types: [
              {
                value: 'P1',
                label: 'Parent only',
              },
              {
                value: 'P2',
                label: 'SMC Parent Member',
              },
              {
                value: 'P3',
                label: 'Safety Committee Member',
              },
              {
                value: 'P4',
                label: 'EWS-DG Parent',
              },
              {
                value: 'P5',
                label: 'Social Worker',
              },
              {
                value: 'P6',
                label: 'Elected Representative Nominee',
              },
            ],
            callResponseTypes: [
              {
                type: 'R1',
                label: 'Call not initiated',
              },
              {
                type: 'R2',
                label: 'Did not pick up',
              },
              {
                type: 'R3',
                label: 'Not reachable',
              },
              {
                type: 'R4',
                label: 'Call back later',
              },
              {
                type: 'R5',
                label: 'Wrong number',
              },
              {
                type: 'R6',
                label: 'Call disconnected mid way',
              },
              {
                type: 'R7',
                label: 'Completed',
              },
              {
                type: 'R00',
                label: 'Call Response Completed But Survey Not Completed.',
              },
            ],
          },
        },
      );

      global.migrationMsg = 'Add parent type and call response type to database.';

      return true;
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
