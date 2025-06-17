/**
 * name : messageConstants/endpoints.js
 * author : Aman
 * Date : 04-May-2020
 * Description : All service endpoints
 */

module.exports = {
  // GET_IMPROVEMENT_PROJECTS : "api/v1/template/getImprovementProjects", // Unnati service
  DOWNLOADABLE_GCP_URL: 'api/v1/cloud-services/gcp/getDownloadableUrl', // Kendra service
  DOWNLOADABLE_AWS_URL: 'api/v1/cloud-services/aws/getDownloadableUrl', // Kendra service
  DOWNLOADABLE_AZURE_URL: 'api/v1/cloud-services/azure/getDownloadableUrl', // Kendra service
  UPLOAD_FILE: 'api/v1/cloud-services/gcp/uploadFile', // Kendra service
  GET_APP_DETAILS: 'api/v1/apps/details', // Kendra service
  GET_USERS_BY_ENTITY_AND_ROLE: 'api/v1/entities/getUsersByEntityAndRole', //kendra service
  SOLUTIONS_BASED_ON_ROLE_LOCATION: 'api/v1/solutions/forUserRoleAndLocation',
  SOLUTION_DETAILS_BASED_ON_ROLE_LOCATION: 'api/v1/solutions/detailsBasedOnRoleAndLocation',
  GET_PROJECT_TEMPLATE_LISTS: 'api/v1/project/templates/listByIds',
  DOWNLOADABLE_FILE_URL: 'api/v1/cloud-services/files/getDownloadableUrl',
  FIND_ENTITY_DOCUMENTS: '/v1/entities/find',
  LIST_BY_ENTITY_TYPE: '/v1/entities/listByEntityType',
  FIND_ENTITY_TYPE_DOCUMENTS :'/v1/entityTypes/find',
  GET_TEMPLATE_DETAILS: '/v1/project/templates/details',
  USER_READ:"/v1/user/read",
	ORGANIZATION_READ: '/v1/organization/read',
  TENANT_READ: '/v1/tenant/read',
  PUBLIC_BRANDING : '/v1/public/branding',
  USER_ROLE_EXTENSION:'/v1/userRoleExtension/find',
  PROFILE_READ:'/v1/profile/read',
  EXTERNAL_PROGRAM_DETAILS: '/v1/programs/details',
  EXTERNAL_PROGRAM_DETAILS_SUPERADMIN: '/v1/programs/getProgramDetails',
  EXTERNAL_PROGRAM_UPDATE: '/v1/programs/update',
  PROJECT_LIST_BY_ID :'/v1/project/templates/listByIds',
  AUTO_DOWNLOAD: '/v1/files/download',
  PUSH_SUBMISSION_TO_TASK: '/v1/userProjects/pushSubmissionToTask',

};
