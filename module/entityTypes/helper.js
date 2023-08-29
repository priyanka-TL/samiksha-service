/**
 * name : entityTyes/helper.js
 * author : Akash
 * created-date : 22-Feb-2019
 * Description : Entity types related helper functionality.
 */

/**
 * EntityTypesHelper
 * @class
 */
module.exports = class EntityTypesHelper {
  /**
   * List of all entity types.
   * @method
   * @name list
   * @param {Object} [queryParameter = "all"] - Filtered query data.
   * @param {Object} [projection = {}] - Projected data.
   * @returns {Object} returns a entity types list from the filtered data.
   */

  static list(queryParameter = 'all', projection = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        if (queryParameter === 'all') {
          queryParameter = {};
        }

        let entityTypeData = await database.models.entityTypes.find(queryParameter, projection).lean();

        return resolve(entityTypeData);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * List of entity types which can be observed in a state.
   * @method
   * @name canBeObserved
   * @param {String} stateId
   * @returns {Object} returns list of all entity type which can be observed in a state.
   */

  static canBeObserved(stateId) {
    return new Promise(async (resolve, reject) => {
      try {
        let observableEntityTypes = await this.list(
          {
            isObservable: true,
          },
          {
            name: 1,
          },
        );

        if (stateId) {
          let entityDocument = await database.models.entities
            .findOne(
              {
                _id: stateId,
              },
              {
                childHierarchyPath: 1,
              },
            )
            .lean();

          if (!entityDocument) {
            return resolve({
              status: httpStatusCode.bad_request.status,
              message: messageConstants.apiResponses.ENTITY_NOT_FOUND,
            });
          }

          let result = [];

          if (entityDocument.childHierarchyPath && entityDocument.childHierarchyPath.length > 0) {
            observableEntityTypes.forEach((entityType) => {
              if (entityDocument.childHierarchyPath.includes(entityType.name)) {
                result.push(entityType);
              }
            });
          }

          observableEntityTypes = result;
        }

        return resolve({
          message: messageConstants.apiResponses.ENTITY_TYPES_FETCHED,
          result: observableEntityTypes,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
};
