module.exports = {
  async up(db) {

    global.migrationMsg = "Update user roles in entites elasticsearch";

    if (!es) {
      throw new Error("Elastic search connection not available.");
    }

    let entitiesIndex = process.env.ELASTICSEARCH_ENTITIES_INDEX;

    if (!entitiesIndex || entitiesIndex == "") {
      throw new Error("Invalid entities index");
    }

    const checkIfIndexExists = await es.indices.exists({ index: entitiesIndex });

    if (checkIfIndexExists.statusCode !== 200) {
      const createIndex = await es.indices.create({ index: entitiesIndex });
      if (createIndex.statusCode != 200) {
        throw new Error("Error while creating entities index.")
      }
    }

    let users = await db.collection('userExtension').find({}).project({ _id: 1 }).toArray();

    let chunkOfUsers = _.chunk(users, 100);

    for (let users = 0; users < chunkOfUsers.length; users++) {

      let userId = chunkOfUsers[users].map(user => {
        return user._id;
      });

      let userDocuments =
        await db.collection('userExtension').find({
          _id: { $in: userId }
        }).project({
          "_id": 1,
          "roles": 1,
          "userId": 1
        }).toArray();

      for (let user = 0; user < userDocuments.length; user++) {

        let userData = userDocuments[user];

        if (userData.roles.length > 0) {

          for (let role = 0; role < userData.roles.length; role++) {

            for (let entity = 0; entity < userData.roles[role].entities.length; entity++) {

              let entityDocument = await es.get({
                id: userData.roles[role].entities[entity],
                index: process.env.ELASTICSEARCH_ENTITIES_INDEX
              }, {
                  ignore: [404],
                  maxRetries: 3
                });

              if (entityDocument.statusCode == 200) {
                entityDocument = entityDocument.body["_source"].data;

                if (!entityDocument.roles) {
                  entityDocument.roles = {};
                }

                if (entityDocument.roles[userData.roles[role].code]) {
                  if (!entityDocument.roles[userData.roles[role].code].includes(userData.userId)) {
                    entityDocument.roles[userData.roles[role].code].push(userData.userId);
                  }
                }
                else {
                  entityDocument.roles[userData.roles[role].code] = [userData.userId];
                }

                await es.update({
                  id: userData.roles[role].entities[entity],
                  index: process.env.ELASTICSEARCH_ENTITIES_INDEX,
                  body: {
                    doc: { data: entityDocument },
                    doc_as_upsert: true
                  }
                })
              }
            }
          }
        }
      }
    }

    return;
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
