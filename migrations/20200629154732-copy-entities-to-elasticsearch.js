module.exports = {
  async up(db) {
    global.migrationMsg = 'Put entity documents in Elastic search';

    if (!es) {
      throw new Error('Elastic search connection not available.');
    }

    let entitiesIndex = process.env.ELASTICSEARCH_ENTITIES_INDEX;

    if (!entitiesIndex || entitiesIndex == '') {
      throw new Error('Invalid entities index');
    }

    const checkIfIndexExists = await es.indices.exists({ index: entitiesIndex });

    if (checkIfIndexExists.statusCode === 200) {
      const deleteIndex = await es.indices.delete({ index: entitiesIndex });
      if (deleteIndex.statusCode != 200) {
        throw new Error('Error while deleting entities index.');
      }
    }

    const createIndex = await es.indices.create({ index: entitiesIndex });

    if (createIndex.statusCode != 200) {
      throw new Error('Error while creating entities index.');
    }

    let entities = await db.collection('entities').find({}).project({ _id: 1 }).toArray();

    let chunkOfEntities = _.chunk(entities, 100);

    for (let entities = 0; entities < chunkOfEntities.length; entities++) {
      let entityId = chunkOfEntities[entities].map((entity) => {
        return entity._id;
      });

      let entityDocuments = await db
        .collection('entities')
        .find({
          _id: { $in: entityId },
        })
        .project({
          _id: 1,
          metaInformation: 1,
          entityType: 1,
          entityTypeId: 1,
          updatedAt: 1,
          createdAt: 1,
        })
        .toArray();

      await Promise.all(
        entityDocuments.map(async (entityDocument) => {
          let telemetryEntities = [];

          let entityObj = {
            _id: entityDocument._id,
            entityType: entityDocument.entityType,
            entityTypeId: entityDocument.entityTypeId,
            updatedAt: entityDocument.updatedAt,
            createdAt: entityDocument.createdAt,
          };

          for (metaData in entityDocument.metaInformation) {
            entityObj[metaData] = entityDocument.metaInformation[metaData];
          }

          let telemetryObj = {
            [`${entityObj.entityType}_name`]: entityObj.name,
            [`${entityObj.entityType}_id`]: entityObj._id,
            [`${entityObj.entityType}_externalId`]: entityObj.externalId,
          };

          let relatedEntitiesQuery = {
            [`groups.${entityObj.entityType}`]: entityObj._id,
            entityTypeId: {
              $ne: entityObj.entityTypeId,
            },
          };

          let relatedEntities = await db
            .collection('entities')
            .find(relatedEntitiesQuery)
            .project({
              'metaInformation.externalId': 1,
              'metaInformation.name': 1,
              entityType: 1,
              entityTypeId: 1,
              _id: 1,
            })
            .toArray();

          if (relatedEntities.length > 0) {
            relatedEntities = relatedEntities.map((entity) => {
              telemetryObj[`${entity.entityType}_name`] = entity.metaInformation.name;

              telemetryObj[`${entity.entityType}_id`] = entity._id;

              telemetryObj[`${entity.entityType}_externalId`] = entity.metaInformation.externalId;

              return {
                name: entity.metaInformation.name,
                externalId: entity.metaInformation.externalId,
                entityType: entity.entityType,
                entityTypeId: entity.entityTypeId,
                _id: entity._id,
              };
            });

            entityObj['relatedEntities'] = relatedEntities;
          }

          telemetryEntities.push(telemetryObj);

          entityObj['telemetry_entities'] = telemetryEntities;

          await es.update({
            id: entityObj._id,
            index: entitiesIndex,
            body: {
              doc: { data: entityObj },
              doc_as_upsert: true,
            },
          });

          return;
        }),
      );
    }

    return;
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
