/**
 * name : programSolutionUtilities.js
 * author : Mallanagouda R Biradar
 * Date : 30-June-2025
 * Description : Program Solution Utility Function
 */

const userService = require(ROOT_PATH + '/generics/services/users');
const entityManagementService = require(ROOT_PATH + '/generics/services/entity-management');

/**
 * Constructs a MongoDB update object to add entities and organizations to the scope.
 *
 * @param {Object} bodyData - Request body containing scope data (e.g., entities, organizations).
 * @param {String} tenantId - Tenant ID for validation and context.
 * @param {String} orgId - Organization ID for validation context.
 * @param {Object} userDetails - Object containing user roles and authentication details.
 * @returns {Promise<Object>} - Returns an object with updateObject and success flag, or an error with status and message.
 */
function getUpdateObjectTOAddScope(bodyData, tenantId, orgId, userDetails) {
  return new Promise(async (resolve, reject) => {
    try {
      const ALL_SCOPE_VALUE = messageConstants.common.ALL_SCOPE_VALUE;
      // Setup for MongoDB update operation using $addToSet
      let updateObject = { $addToSet: {} };
      let validationExcludedEntitiesKeys = [];
      let tenantDetails;
      let adminTenantAdminRole = [messageConstants.common.ADMIN, messageConstants.common.TENANT_ADMIN];

      // Check if user is Admin or Tenant Admin
      if (gen.utils.validateRoles(userDetails.roles, adminTenantAdminRole)) {
        // Fetch tenant details to validate org codes and scope keys
        tenantDetails = await userService.fetchTenantDetails(tenantId, userDetails.userToken);
        if (!tenantDetails?.success || !tenantDetails?.data?.meta) {
          throw {
            message: messageConstants.apiResponses.FAILED_TO_FETCH_TENANT_DETAILS,
            status: httpStatusCode.bad_request.status,
          };
        }

        // Store validation-excluded scope keys if present
        if (
          Array.isArray(tenantDetails?.data?.meta?.validationExcludedScopeKeys) &&
          tenantDetails.data.meta.validationExcludedScopeKeys.length > 0
        ) {
          // Fetch tenant details (will include valid org codes & validationExcludedScopeKeys)
          validationExcludedEntitiesKeys.push(...tenantDetails.data.meta.validationExcludedScopeKeys);
        }

        // Handle organization values if passed
        if (bodyData.organizations) {
          if (Array.isArray(bodyData.organizations)) {
            if (bodyData.organizations.includes(ALL_SCOPE_VALUE)) {
              // Add "ALL" if specified
              updateObject.$addToSet[`scope.organizations`] = { $each: [ALL_SCOPE_VALUE] };
            } else {
              const validOrgCodes = tenantDetails.data.organizations.map((org) => org.code);
              const isValid = bodyData.organizations.every((orgCode) => validOrgCodes.includes(orgCode));
              if (!isValid) {
                throw {
                  message: messageConstants.apiResponses.INVALID_ORGANIZATION,
                  status: httpStatusCode.bad_request.status,
                };
              }
              updateObject.$addToSet[`scope.organizations`] = { $each: bodyData.organizations };
            }
          }
        }
      }

      // This logic we need to re-look --------------------------------------------
      // if (solutionData[0].scope !== programData[0].scope) {
      // 	let checkEntityInParent = await entitiesService.entityDocuments(
      // 		{
      // 			_id: programData[0].scope.entities,- state
      // 			[`groups.${solutionData[0].scope.entityType}`]: entities,- district
      // 		},
      // 		['_id']
      // 	)
      // 	if (!checkEntityInParent.success) {
      // 		throw {
      // 			message: messageConstants.apiResponses.ENTITY_NOT_EXISTS_IN_PARENT,
      // 		}
      // 	}
      // }

      // Extract entities from the request body
      let entities = bodyData.entities;
      let groupedEntities = {};
      let keysForValidation = [];
      // Classify keys based on ALL presence or validationExcludedEntitiesKeys
      for (const [entityType, values] of Object.entries(entities)) {
        if (Array.isArray(values) && values.includes(ALL_SCOPE_VALUE)) {
          // If "ALL" present, skip validation and directly assign
          groupedEntities[entityType] = [ALL_SCOPE_VALUE];
        } else if (validationExcludedEntitiesKeys.includes(entityType)) {
          // Excluded from validation
          groupedEntities[entityType] = values;
        } else {
          // Needs validation
          keysForValidation.push(entityType);
        }
      }

      // Validate only if needed
      let entitiesToValidate = keysForValidation.flatMap((key) => entities[key]);
      if (entitiesToValidate.length > 0) {
        let entitiesData = await entityManagementService.entityDocuments(
          {
            _id: { $in: entitiesToValidate },
            tenantId: tenantId,
          },
          ['_id', 'entityType']
        );
        if (!entitiesData.success || !entitiesData.data.length > 0) {
          throw {
            message: messageConstants.apiResponses.ENTITIES_NOT_FOUND,
            status: httpStatusCode.bad_request.status,
          };
        }
        // Create a map for fast lookup
        let validEntitiesMap = new Map();
        for (const entity of entitiesData.data) {
          const key = `${entity._id}-${entity.entityType}`;
          validEntitiesMap.set(key, true);
        }

        // Iterate through each entityType and its corresponding IDs in the request body
        for (const [entityType, ids] of Object.entries(entities)) {
          if (!keysForValidation.includes(entityType)) continue;

          // Skip validation for entityTypes that are either excluded or already marked as ALL
          for (const id of ids) {
            const key = `${id}-${entityType}`;
            // If the current id-entityType pair is not found in the validated entity map, throw an error
            if (!validEntitiesMap.has(key)) {
              throw {
                message: `${entityType} with id ${id} is invalid or not found`,
                status: httpStatusCode.bad_request.status,
              };
            }
            // Initialize the array for this entityType in groupedEntities if it doesn't exist
            if (!groupedEntities[entityType]) {
              groupedEntities[entityType] = [];
            }
            groupedEntities[entityType].push(id);
          }
        }
      }
      // Construct $addToSet object
      for (const [type, ids] of Object.entries(groupedEntities)) {
        updateObject.$addToSet[`scope.${type}`] = { $each: ids };
      }
      return resolve({
        updateObject,
        success: true,
      });
    } catch (error) {
      return resolve({
        success: false,
        status: error.status ? error.status : httpStatusCode['internal_server_error'].status,
        message: error.message,
      });
    }
  });
}

/**
 * Generates an updated scope object by removing specified entities and updating empty scopes with "ALL" based on tenant metadata.
 *
 * @param {Object} currentScope - The existing scope object from which values need to be removed.
 * @param {Object} bodyData - Object containing entities to be removed (e.g., { district: ["xyz"], organizations: ["abc"] }).
 * @param {String} tenantId - ID of the tenant, used for fetching validation-related metadata.
 * @param {Object} userDetails - Object containing user information and token, including roles for permission validation.
 * @returns {Promise<Object>} - Resolves with an object containing updatedScope and success flag, or error status and message.
 */
function getUpdateObjectToRemoveScope(currentScope, bodyData, tenantId, userDetails) {
  return new Promise(async (resolve, reject) => {
    try {
      const ALL_SCOPE_VALUE = messageConstants.common.ALL_SCOPE_VALUE;

      // Deep copy to avoid mutation
      let updatedScope = JSON.parse(JSON.stringify(currentScope));

      // Check if user has Admin or Tenant Admin roles to allow org scope modification
      let adminTenantAdminRole = [messageConstants.common.ADMIN, messageConstants.common.TENANT_ADMIN];
      let tenantDetails;
      if (gen.utils.validateRoles(userDetails.roles, adminTenantAdminRole)) {
        // Fetch tenant meta details if user is admin/tenant admin
        tenantDetails = await userService.fetchTenantDetails(tenantId, userDetails.userToken);
        if (!tenantDetails?.success || !tenantDetails?.data?.meta) {
          throw {
            message: messageConstants.apiResponses.FAILED_TO_FETCH_TENANT_DETAILS,
            status: httpStatusCode.bad_request.status,
          };
        }
      }

      // Remove entity values from current scope
      const entitiesToRemove = bodyData.entities || {};
      for (const [key, valuesToRemove] of Object.entries(entitiesToRemove)) {
        const currentValues = updatedScope[key] || [];
        // If current scope does not contain an array for the key, throw error
        if (!Array.isArray(currentValues)) {
          throw {
            message: `${key} is not present in solution scope`,
            status: httpStatusCode.bad_request.status,
          };
        }
        // Remove matching values
        updatedScope[key] = currentValues.filter((val) => !valuesToRemove.includes(val));
      }

      // Fill with ALL for empty keys listed in tenant meta.factors
      const factorKeys = tenantDetails?.data?.meta?.factors || [];
      for (const factorKey of factorKeys) {
        if (!Array.isArray(updatedScope[factorKey]) || updatedScope[factorKey].length === 0) {
          updatedScope[factorKey] = [ALL_SCOPE_VALUE];
        }
      }

      return resolve({
        updatedScope,
        success: true,
      });
    } catch (error) {
      return resolve({
        success: false,
        status: error.status ? error.status : httpStatusCode['internal_server_error'].status,
        message: error.message,
      });
    }
  });
}

module.exports = {
  getUpdateObjectTOAddScope,
  getUpdateObjectToRemoveScope,
};
