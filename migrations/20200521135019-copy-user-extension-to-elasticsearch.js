module.exports = {
  async up(db) {
    global.migrationMsg = "Put user extension details in Elasticsearch";

    if(!es) {
      throw new Error("Elastic search connection not available.");
    }

    let userExtensionIndex = process.env.ELASTICSEARCH_USER_EXTENSION_INDEX;

    if(!userExtensionIndex || userExtensionIndex == "") {
      throw new Error("Invalid user extension index");
    }

    const checkIfIndexExists = await es.indices.exists({ index: userExtensionIndex});

    if(checkIfIndexExists.statusCode === 200) {
      const deleteIndex = await es.indices.delete({ index: userExtensionIndex});
      if(deleteIndex.statusCode != 200) {
        throw new Error("Error while deleting user extension index.");
      }
    }

    const createIndex = await es.indices.create({ index: userExtensionIndex});

    if(createIndex.statusCode != 200) {
      throw new Error("Error while creating user extension index.")
    }

    let userExtensions = 
    await db.collection('userExtension').find({}).project({ _id : 1 }).toArray();

    let chunkOfUsers = _.chunk(userExtensions, 100);
    
    for ( let users = 0; users < chunkOfUsers.length; users++ ) {

      let usersId = chunkOfUsers[users].map(user => {
        return user._id;
      });

      let userDocumentArray = 
      await db.collection('userExtension').find({
        _id : { $in : usersId }
      }).project({ 
        _id : 1, 
        roles : 1,
        status : 1, 
        isDeleted : 1,
        deleted : 1,
        userId : 1,
        externalId : 1,
        updatedBy : 1,
        createdBy : 1,
        updatedAt : 1,
        createdAt : 1,
      }).toArray();

      await Promise.all(userDocumentArray.map(async userDocument=>{

        await es.update({
          id : userDocument.userId,
          index: userExtensionIndex,
          body: {
            doc : { data : userDocument },
            doc_as_upsert : true
          }
        });

        return;

      }))


    }

    return;


  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
