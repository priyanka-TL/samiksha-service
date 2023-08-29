module.exports = {
  async up(db) {
    global.migrationMsg = 'Created default user roles.';

    await db.collection('userRoles').createIndex({ code: 1 }, { unique: true });

    let entityTypes = await db.collection('entityTypes').find({}).toArray();
    let entityCodeToEntityMap = {};

    entityTypes.forEach((entityType) => {
      entityCodeToEntityMap[entityType.name] = {
        entityTypeId: entityType._id,
        entityType: entityType.name,
      };
    });

    let hmrole = {
      code: 'HM',
      entityTypes: [entityCodeToEntityMap['school']],
      title: 'Headmaster',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      status: 'active',
      isDeleted: false,
    };

    let crprole = {
      code: 'CRP',
      entityTypes: [entityCodeToEntityMap['cluster']],
      title: 'Cluster Resource Person',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      status: 'active',
      isDeleted: false,
    };

    let beorole = {
      code: 'BEO',
      entityTypes: [entityCodeToEntityMap['block']],
      title: 'Block Education Officer',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      status: 'active',
      isDeleted: false,
    };

    let deorole = {
      code: 'DEO',
      entityTypes: [entityCodeToEntityMap['district']],
      title: 'District Education Officer',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      status: 'active',
      isDeleted: false,
    };

    let zoneLeaderRole = {
      code: 'ZL',
      entityTypes: [entityCodeToEntityMap['zone']],
      title: 'Zone Leader',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      status: 'active',
      isDeleted: false,
    };

    let stateProjectDirectorRole = {
      code: 'SPD',
      entityTypes: [entityCodeToEntityMap['state']],
      title: 'State Project Director',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      status: 'active',
      isDeleted: false,
    };

    return await db
      .collection('userRoles')
      .insertMany([hmrole, crprole, beorole, deorole, zoneLeaderRole, stateProjectDirectorRole]);
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
