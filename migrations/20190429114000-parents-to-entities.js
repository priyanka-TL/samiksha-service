module.exports = {
  async up(db) {
    global.migrationMsg = 'Migrated up parents-to-entities file';

    if (process.env.TRANSFER_FROM_DB !== '') {
      let sourceDB = global.transferFromDb;

      let parents = await sourceDB.collection('parentRegistry').find({}).toArray();

      if (!parents.length > 0) return;

      let schoolParents = {};

      let parentsArray = new Array();

      let parentEntity = await db
        .collection('entityTypes')
        .find({
          name: 'parent',
        })
        .toArray();

      for (let parentCounter = 0; parentCounter < parents.length; parentCounter++) {
        parents[parentCounter].createdByProgramId = ObjectID(parents[parentCounter].programId);
        if (schoolParents[parents[parentCounter].schoolId]) {
          schoolParents[parents[parentCounter].schoolId].parents.push(parents[parentCounter]._id);
        } else {
          schoolParents[parents[parentCounter].schoolId] = {
            parents: [parents[parentCounter]._id],
          };
        }

        parentsArray.push({
          _id: parents[parentCounter]._id,
          entityTypeId: parentEntity[0]._id,
          entityType: 'parent',
          regsitryDetails: {},
          groups: {},
          metaInformation: _.omit(parents[parentCounter], [
            '_id',
            'createdAt',
            'createdBy',
            'updatedAt',
            'updatedBy',
            '__v',
            'isDeleted',
            'programId',
            'schoolId',
          ]),
          updatedBy: parents[parentCounter].updatedBy ? parents[parentCounter].updatedBy : 'INITIALIZE',
          createdBy: parents[parentCounter].createdBy ? parents[parentCounter].createdBy : 'INITIALIZE',
          createdAt: parents[parentCounter].createdAt ? parents[parentCounter].createdAt : new Date(),
          updatedAt: parents[parentCounter].updatedAt ? parents[parentCounter].updatedAt : new Date(),
          isDeleted: false,
        });
      }

      global.migrationMsg = 'Total parents transferred - ' + parents.length;

      await Promise.all(
        Object.keys(schoolParents).map(async (schoolId) => {
          await db.collection('entities').findOneAndUpdate(
            {
              _id: ObjectID(schoolId),
            },
            {
              $set: { 'groups.parent': schoolParents[schoolId].parents },
            },
          );
        }),
      );

      return await db.collection('entities').insertMany(parentsArray);
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
