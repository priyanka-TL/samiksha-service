module.exports = {
  async up(db) {
    
    let allEntityTypes = await db.collection('entityTypes').find({}).toArray();

    global.migrationMsg = "Migrated up addEntityTypeToObservationsAndSubmissions file";

    if(allEntityTypes.length>0) {

      global.migrationMsg = "Add entity type to submissions and observation submissions."
      
      for (let pointerToAllEntityTypes = 0; pointerToAllEntityTypes < allEntityTypes.length; pointerToAllEntityTypes++) {
      
      await db.collection('submissions').updateMany( {entityTypeId:allEntityTypes[pointerToAllEntityTypes]._id}, { $set: { "entityType": allEntityTypes[pointerToAllEntityTypes].name } } )

      await db.collection('observationSubmissions').updateMany( {entityTypeId:allEntityTypes[pointerToAllEntityTypes]._id}, { $set: { "entityType": allEntityTypes[pointerToAllEntityTypes].name } } )

      }


    return
  }},

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
