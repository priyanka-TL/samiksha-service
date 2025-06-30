// const jwtDecode = require("jwt-decode");
// let slackClient = require("../helpers/slackCommunications");
// var ApiInterceptor = require("./lib/apiInterceptor");
var messageUtil = require('./lib/messageUtil');
var responseCode = require('../httpStatusCodes');
const jwt = require('jsonwebtoken');
const instance = require('./Instance.json');
const path = require('path');
const fs = require('fs');
const isBearerRequired = process.env.IS_AUTH_TOKEN_BEARER === 'true';
const userService = require(ROOT_PATH + '/generics/services/users');


// var shikshalokam = require("../helpers/shikshalokam");

var reqMsg = messageUtil.REQUEST;
// var keyCloakConfig = {
//   authServerUrl: process.env.sunbird_keycloak_auth_server_url,
//   realm: process.env.sunbird_keycloak_realm,
//   clientId: process.env.sunbird_keycloak_client_id,
//   public: process.env.sunbird_keycloak_public,
// };

// var cacheConfig = {
//   store: process.env.sunbird_cache_store,
//   ttl: process.env.sunbird_cache_ttl,
// };

var respUtil = function (resp) {
  return {
    status: resp.errCode,
    message: resp.errMsg,
    currentDate: new Date().toISOString(),
  };
};


/**
 *
 * @function
 * @name validateOrgsPassedInHeader
 * @param {Array} orgsFromHeader - Array of organization IDs passed in header.
 * @param {String} tenantId - Tenant ID to validate against.
 * @returns {Promise<Object>} Returns a promise that resolves to validation result object.
 */
var validateOrgsPassedInHeader = async function(orgsFromHeader,tenantId){
  let tenantInfo = await userService.fetchDefaultOrgDetails(tenantId);
  let related_orgs = tenantInfo.data.related_orgs;
  let validOrgs = [];
  let result = {
    success: false,
    data: [],
  };

  if(!related_orgs || related_orgs.length == 0){
    return result;
  }

  for(let org of orgsFromHeader){

    if(related_orgs.includes(org)){
      validOrgs.push(org);
    }

  }

  if(validOrgs.length > 0){
    result.success = true;
    result.data = validOrgs;
  }

  return result;
}

var removedHeaders = [
  'host',
  // 'origin',
  'accept',
  'referer',
  'content-length',
  'accept-encoding',
  'accept-language',
  'accept-charset',
  'cookie',
  'dnt',
  'postman-token',
  'cache-control',
  'connection',
];

// async function getUserDetails(decodedToken){
//   let result = {}
//   let instanceData = instance[process.env.Instance]
//   Object.keys(instanceData).forEach((key)=>{
//     if(instanceData[key] !== "NA"){
//       let values = instanceData[key]
//       result[key] = decodedToken[values]
//       console.log(decodedToken[values])
//     }
//   })
//   return result
// }

module.exports = async function (req, res, next) {
  if (req.path.includes('/sharedLinks/verify')) return next();

  if (req.headers && req.headers.linkid) {
    let isShareable = await database.models.sharedLink.findOne({
      linkId: req.headers.linkid,
      isActive: true,
    });

    let requestURL = req.url.includes('?') ? req.url.split('?')[0] : req.url;

    if (isShareable && requestURL.includes(isShareable.reportName)) {
      req.url = isShareable.queryParams ? requestURL + '?' + isShareable.queryParams : requestURL;

      req.userDetails = isShareable.userDetails;

      return next();
    } else {
      let msg = 'Bad request.';

      const slackMessageForBadRequest = {
        userIP: req.headers['x-real-ip'],
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
        errorMsg: msg,
        customFields: null,
      };

      slackClient.badSharedLinkAccessAttemptAlert(slackMessageForBadRequest);

      let rspObj = {};

      rspObj.errCode = 400;

      rspObj.errMsg = msg;

      rspObj.responseCode = 400;

      return res.status(400).send(respUtil(rspObj));
    }
  }

  removedHeaders.forEach(function (e) {
    delete req.headers[e];
  });

  let paths = [
    'reports',
    'pendingAssessments',
    'completedAssessments',
    'pendingObservations',
    'completedObservations',
    // 'solutionDetails',
    '/programs/listByIds',
    'frameworks/delete/',
    'questions/delete/',
    'observationSubmissions/disable/',
  ];

  if (!req.rspObj) req.rspObj = {};
  var rspObj = req.rspObj;

  let token = req.headers['x-auth-token'];

  	// Allow search endpoints for non-logged in users.
	let guestAccess = false
	let guestAccessPaths = [
		'files/download',
	]
	await Promise.all(
		guestAccessPaths.map(async function (path) {
			if (req.path.includes(path)) {
				guestAccess = true
			}
		})
	)

	if (guestAccess == true && !token) {
		next()
		return
	}

  let internalAccessApiPaths = [
    'createGesture',
    'createEmoji',
    'solutionDetails',
    'solutions/create',
    'solutions/updateSolutions',
    'solutions/addEntities',
    'programs/addEntities',
    'solutions/list',
    'frameworks/delete/',
    'questions/delete/',
    'observationSubmissions/disable/',
    'programs/create',
    'programs/update',
    'observations/importFromFramework',
    'surveys/createSolutionTemplate',
    'solutions/getDetails',
    'solutions/update',
    'solutions/uploadThemesRubricExpressions',
    'solutions/uploadCriteriaRubricExpressions',
    'solutions/importFromSolution',
    'surveys/importSurveyTemplateToSolution',
    'surveys/mapSurveySolutionToProgram',
    "criteria/upload",
    "questions/bulkCreate",
    "frameworks/create",
    "frameworks/uploadThemes",
    "forms/create",
    "forms/update",
    'users/deleteUserPIIData',
    'userExtension/bulkUpload'
  ];

  let performInternalAccessTokenCheck = false;
  let adminHeader = false;
  if (process.env.ADMIN_ACCESS_TOKEN) {
    adminHeader = req.headers[process.env.ADMIN_TOKEN_HEADER_NAME];
  }

  await Promise.all(
    internalAccessApiPaths.map(async function (path) {
      if (req.path.includes(path)) {
        performInternalAccessTokenCheck = true;
      }
    })
  );

  if (performInternalAccessTokenCheck) {
    if (req.headers['internal-access-token'] !== process.env.INTERNAL_ACCESS_TOKEN) {
      rspObj.errCode = reqMsg.TOKEN.MISSING_CODE;
      rspObj.errMsg = reqMsg.TOKEN.MISSING_MESSAGE;
      rspObj.responseCode = responseCode.unauthorized.status;
      return res.status(401).send(respUtil(rspObj));
    }
    if (!token) {
			next()
			return
		}
  }

  // Check if a Bearer token is required for authentication
  if (isBearerRequired) {
    const [authType, extractedToken] = token.split(' ');
    if (authType.toLowerCase() !== 'bearer') {
      rspObj.errCode = reqMsg.TOKEN.INVALID_CODE;
      rspObj.errMsg = reqMsg.TOKEN.INVALID_MESSAGE;
      rspObj.responseCode = responseCode.unauthorized.status;
      return res.status(401).send(respUtil(rspObj));
    }
    token = extractedToken?.trim();
  } else {
    token = token?.trim();
  }

  //api need both internal access token and x-authenticated-user-token
  const internalAccessAndTokenApiPaths = ['entityAssessors/create'];
  let performInternalAccessTokenAndTokenCheck = false;
  await Promise.all(
    internalAccessAndTokenApiPaths.map(async function (path) {
      if (req.path.includes(path)) {
        performInternalAccessTokenAndTokenCheck = true;
      }
    })
  );

  if (performInternalAccessTokenAndTokenCheck) {
    if (req.headers['internal-access-token'] !== process.env.INTERNAL_ACCESS_TOKEN || !token) {
      rspObj.errCode = reqMsg.TOKEN.MISSING_CODE;
      rspObj.errMsg = reqMsg.TOKEN.MISSING_MESSAGE;
      rspObj.responseCode = responseCode.unauthorized.status;
      return res.status(401).send(respUtil(rspObj));
    }
  }

  //api need either x-authenticated-user-token or internal access token
  const insternalAccessTokenOrTokenPaths = ['userExtension/getProfile/', 'entities/relatedEntities/'];
  let performInternalAccessTokenOrTokenCheck = false;
  await Promise.all(
    insternalAccessTokenOrTokenPaths.map(async function (path) {
      if (req.path.includes(path)) {
        performInternalAccessTokenOrTokenCheck = true;
      }
    })
  );

  if (performInternalAccessTokenOrTokenCheck && !token) {
    if (req.headers['internal-access-token'] !== process.env.INTERNAL_ACCESS_TOKEN) {
      rspObj.errCode = reqMsg.TOKEN.MISSING_CODE;
      rspObj.errMsg = reqMsg.TOKEN.MISSING_MESSAGE;
      rspObj.responseCode = responseCode.unauthorized.status;
      return res.status(401).send(respUtil(rspObj));
    } else {
      next();
      return;
    }
  }

  for (let pointerToByPassPath = 0; pointerToByPassPath < paths.length; pointerToByPassPath++) {
    if (
      (req.path.includes(paths[pointerToByPassPath]) || (req.query.csv && req.query.csv == true)) &&
      req.headers['internal-access-token'] === process.env.INTERNAL_ACCESS_TOKEN
    ) {
      req.setTimeout(parseInt(REQUEST_TIMEOUT_FOR_REPORTS));
      next();
      return;
    }
  }

  let decodedToken = null;
  try {
    if (process.env.AUTH_METHOD === messageConstants.common.AUTH_METHOD.NATIVE) {
      try {
        // If using native authentication, verify the JWT using the secret key
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      } catch (err) {
        // If verification fails, send an unauthorized response
        rspObj.errCode = reqMsg.TOKEN.MISSING_CODE;
        rspObj.errMsg = reqMsg.TOKEN.MISSING_MESSAGE;
        rspObj.responseCode = responseCode.unauthorized.status;
        return res.status(responseCode['unauthorized'].status).send(respUtil(rspObj));
      }
    } else if (process.env.AUTH_METHOD === messageConstants.common.AUTH_METHOD.KEYCLOAK_PUBLIC_KEY) {
      // If using Keycloak with a public key for authentication
      const keycloakPublicKeyPath = `${process.env.KEYCLOAK_PUBLIC_KEY_PATH}/`;
      const PEM_FILE_BEGIN_STRING = '-----BEGIN PUBLIC KEY-----';
      const PEM_FILE_END_STRING = '-----END PUBLIC KEY-----';

      // Decode the JWT to extract its claims without verifying
      const tokenClaims = jwt.decode(token, { complete: true });

      if (!tokenClaims || !tokenClaims.header) {
        // If the token does not contain valid claims or header, send an unauthorized response
        rspObj.errCode = reqMsg.TOKEN.MISSING_CODE;
        rspObj.errMsg = reqMsg.TOKEN.MISSING_MESSAGE;
        rspObj.responseCode = responseCode.unauthorized.status;
        return res.status(responseCode['unauthorized'].status).send(respUtil(rspObj));
      }

      // Extract the key ID (kid) from the token header
      const kid = tokenClaims.header.kid;
      // Construct the path to the public key file using the key ID
      let filePath = path.resolve(__dirname, keycloakPublicKeyPath, kid.replace(/\.\.\//g, ''));
      // Read the public key file from the resolved file path
      const accessKeyFile = await fs.promises.readFile(filePath, 'utf8');
      // Ensure the public key is properly formatted with BEGIN and END markers
      const cert = accessKeyFile.includes(PEM_FILE_BEGIN_STRING)
        ? accessKeyFile
        : `${PEM_FILE_BEGIN_STRING}\n${accessKeyFile}\n${PEM_FILE_END_STRING}`;

      let verifiedClaims;
      try {
        // Verify the JWT using the public key and specified algorithms
        verifiedClaims = jwt.verify(token, cert, { algorithms: ['sha1', 'RS256', 'HS256'] });
      } catch (err) {
        // If the token is expired or any other error occurs during verification
        if (err.name === 'TokenExpiredError') {
          rspObj.errCode = reqMsg.TOKEN.INVALID_CODE;
          rspObj.errMsg = reqMsg.TOKEN.INVALID_MESSAGE;
          rspObj.responseCode = responseCode.unauthorized.status;
          return res.status(responseCode['unauthorized'].status).send(respUtil(rspObj));
        }
      }

      // Extract the external user ID from the verified claims
      const externalUserId = verifiedClaims.sub.split(':').pop();

      const data = {
        id: externalUserId,
        roles: [], // this is temporariy set to an empty array, it will be corrected soon...
        name: verifiedClaims.name,
        organization_id: verifiedClaims.org || null,
      };

      // Ensure decodedToken is initialized as an object
      decodedToken = decodedToken || {};
      decodedToken['data'] = data;
    }
  } catch (err) {
    rspObj.errCode = reqMsg.TOKEN.MISSING_CODE;
    rspObj.errMsg = reqMsg.TOKEN.MISSING_MESSAGE;
    rspObj.responseCode = responseCode.unauthorized.status;
    return res.status(responseCode['unauthorized'].status).send(respUtil(rspObj));
  }
  if (!decodedToken) {
    rspObj.errCode = reqMsg.TOKEN.MISSING_CODE;
    rspObj.errMsg = reqMsg.TOKEN.MISSING_MESSAGE;
    rspObj.responseCode = responseCode.unauthorized.status;
    return res.status(responseCode['unauthorized'].status).send(respUtil(rspObj));
  }

  // Path to config.json
  let configFilePath
  if (process.env.AUTH_CONFIG_FILE_PATH) {
    configFilePath = path.resolve(ROOT_PATH, process.env.AUTH_CONFIG_FILE_PATH)
  }
  // Initialize variables
  let configData = {};
  let defaultTokenExtraction = false;

  if (fs.existsSync(configFilePath)) {
    // Read and parse the config.json file
    const rawData = fs.readFileSync(configFilePath);
    try {
      configData = JSON.parse(rawData);
      if (!configData.authTokenUserInformation) {
        defaultTokenExtraction = true;
      }
      configData = configData.authTokenUserInformation;
    } catch (error) {
      console.error('Error parsing config.json:', error);
    }
  } else {
    // If file doesn't exist, set defaultTokenExtraction to true
    defaultTokenExtraction = true;
  }


	let organizationKey = 'organization_id'

  let userInformation = {};
  // Create user details to request
  req.userDetails = {
    userToken: token,
  };
  // performing default token data extraction
  if (defaultTokenExtraction) {
    if (!decodedToken.data.organization_ids || !decodedToken.data.tenant_id) {
      rspObj.errCode = reqMsg.TENANT_ORG_MISSING.MISSING_CODE;
      rspObj.errMsg = reqMsg.TENANT_ORG_MISSING.MISSING_MESSAGE;
      rspObj.responseCode = responseCode.unauthorized.status;
      return res.status(responseCode.unauthorized.status).send(respUtil(rspObj));
    }

    //here assuming that req.headers['orgid'] will be a single value it multiple passed first element of the array will be taken
    let fetchSingleOrgIdFunc = await fetchSingleOrgIdFromProvidedData(decodedToken.data.tenant_id.toString(),decodedToken.data.organization_ids,req.headers['orgid'],token)

    if(!fetchSingleOrgIdFunc.success){
      return res.status(responseCode.unauthorized.status).send(respUtil(fetchSingleOrgIdFunc.errorObj));
    }

    userInformation = {
      userToken: token,
      userId: typeof decodedToken.data.id == 'string' ? decodedToken.data.id : JSON.stringify(decodedToken.data.id),
      userName: decodedToken.data.name,
      firstName: decodedToken.data.name,
      organizationId:fetchSingleOrgIdFunc.orgId,
      tenantId: decodedToken.data.tenant_id && decodedToken.data.tenant_id.toString(),
      roles: decodedToken.data.roles,
    };
  } else {
    for (let key in configData) {
      if (configData.hasOwnProperty(key)) {
        let keyValue = getNestedValue(decodedToken, configData[key])
        if(key == 'userId'){
          keyValue = keyValue?.toString()
        }
        if (key === organizationKey) {
          let value = getOrgId(req.headers, decodedToken, configData[key])
          userInformation[`organizationId`] = value.toString()
          decodedToken.data[key] = value
          continue
        }
        if (key === 'roles') {
          let orgId = getOrgId(req.headers, decodedToken, configData[organizationKey])
          // Now extract roles using fully dynamic path
          const rolePathTemplate = configData['roles']
          decodedToken.data[organizationKey] = orgId
          const resolvedRolePath = resolvePathTemplate(rolePathTemplate, decodedToken.data)
          const roles = getNestedValue(decodedToken, resolvedRolePath) || []
          userInformation[`${key}`] = roles
          decodedToken.data[key] = roles
          continue
        }

        // For each key in config, assign the corresponding value from decodedToken
        decodedToken.data[key] = keyValue
        if (key == 'tenant_id') {
          userInformation[`tenantId`] = keyValue.toString()
        } else {
          userInformation[`${key}`] = keyValue
        }
      }
    }
    userInformation['userToken'] = token;
  }

  if (userInformation.roles && Array.isArray(userInformation.roles) && userInformation.roles.length) {
    userInformation.roles = userInformation.roles.map((role) => role.title)
  }

  if (!userInformation.organizationId || !userInformation.tenantId) {
    rspObj.errCode = reqMsg.TENANT_ORG_MISSING.MISSING_CODE;
    rspObj.errMsg = reqMsg.TENANT_ORG_MISSING.MISSING_MESSAGE;
    rspObj.responseCode = responseCode.unauthorized.status;
    return res.status(responseCode.unauthorized.status).send(respUtil(rspObj));
  }
  

  /**
   * Validate if provided orgId(s) belong to the tenant by checking against related_orgs.
   *
   * @param {String} tenantId - ID of the tenant
   * @param {String} orgId - Comma separated string of org IDs or 'ALL'
   * @param {String} token - User token
   * @returns {Object} - Success with validOrgIds array or failure with error object
   */
  async function validateIfOrgsBelongsToTenant(tenantId, orgId,token) {
    let orgIdArr = Array.isArray(orgId) ? orgId : typeof orgId === 'string' ? orgId.split(',') : [];
    let orgDetails = await userService.fetchTenantDetails(tenantId,token);
    let validOrgIds = null;

    if (orgIdArr.includes('ALL') || orgIdArr.includes('all')) {
      validOrgIds = ['ALL'];
    } else {
      if (
        !orgDetails ||
        !orgDetails.success ||
        !orgDetails.data ||
        !(Object.keys(orgDetails.data).length > 0) ||
        !orgDetails.data.organizations ||
        !(orgDetails.data.organizations.length > 0)
      ) {
        let errorObj = {};
        errorObj.errCode = messageConstants.apiResponses.ORG_DETAILS_FETCH_UNSUCCESSFUL_CODE;
        errorObj.errMsg = messageConstants.apiResponses.ORG_DETAILS_FETCH_UNSUCCESSFUL_MESSAGE;
        errorObj.responseCode = httpStatusCode['bad_request'].status;
        return { success: false, errorObj: errorObj };
      }

      // convert the types of items to string
      orgDetails.data.related_orgs = orgDetails.data.organizations.map((data)=>{
        return data.code.toString();
      });
      // aggregate valid orgids

      let relatedOrgIds = orgDetails.data.related_orgs;

      validOrgIds = orgIdArr.filter((id) => relatedOrgIds.includes(id));

      if (!(validOrgIds.length > 0)) {
        let errorObj = {};
        errorObj.errCode = reqMsg.ORGID.INVALID_ORGS;
        errorObj.errMsg = reqMsg.ORGID.INVALID_ORGS_MESSAGE;
        errorObj.responseCode = responseCode.unauthorized.status;
        return { success: false, errorObj: errorObj };
      }
    }

    return { success: true, validOrgIds: validOrgIds };
  }

/**
 * Fetches a valid orgId from the provided data, checking if it's valid for the given tenant.
 *
 * @param {String} tenantId - ID of the tenant
 * @param {String[]} orgIdArr - Array of orgIds to choose from
 * @param {String} orgIdFromHeader - The orgId provided in the request headers
 * @param {String} token - User token
 * @returns {Promise<Object>} - Returns a promise resolving to an object containing the success status, orgId, or error details
 */
  async function fetchSingleOrgIdFromProvidedData(tenantId, orgIdArr, orgIdFromHeader,token) {
    try {
      // Check if orgIdFromHeader is provided and valid
      if (orgIdFromHeader && orgIdFromHeader != '') {
        if (!orgIdArr.includes(orgIdFromHeader)) {
          throw reqMsg.ORG_ID_FETCH_ERROR.MISSING_CODE;
        }
  
        let validateOrgsResult = await validateIfOrgsBelongsToTenant(tenantId, orgIdFromHeader,token);
  
        if (!validateOrgsResult.success) {
          throw reqMsg.ORG_ID_FETCH_ERROR.MISSING_CODE;
        }
  
        return { success: true, orgId: orgIdFromHeader };
      }
  
      // If orgIdFromHeader is not provided, check orgIdArr
      if (orgIdArr.length > 0) {
        return { success: true, orgId: orgIdArr[0] };
      }
  
      // If no orgId is found, throw error
      throw reqMsg.ORG_ID_FETCH_ERROR.MISSING_CODE;
  
    } catch (err) {
      // Handle error when no valid orgId is found
      if (orgIdArr.length > 0) {
        return { success: true, orgId: orgIdArr[0] };
      }
  
      let rspObj = {
        errCode: reqMsg.ORG_ID_FETCH_ERROR.MISSING_CODE,
        errMsg: reqMsg.ORG_ID_FETCH_ERROR.MISSING_MESSAGE,
        responseCode: responseCode.unauthorized.status
      };
  
      return { success: false, errorObj: rspObj };
    }
  }
  

  /**
   * Extract tenantId and orgId from incoming request or decoded token.
   *
   * Priority order: body -> query -> headers -> decoded token data
   *
   * @param {Object} req - Express request object
   * @param {Object} decodedTokenData - Decoded JWT token data
   * @returns {Object} - Success with tenantId and orgId or failure object
   */
  function getTenantIdAndOrgIdFromTheTheReqIntoHeaders(req, decodedTokenData) {
    // Step 1: Check in the request body
    if (req.body && req.body.tenantId && req.body.orgId) {
      return { success: true, tenantId: req.body.tenantId, orgId: req.body.orgId };
    }

    // Step 2: Check in query parameters if not found in body
    if (req.query.tenantId && req.query.orgId) {
      return { success: true, tenantId: req.query.tenantId, orgId: req.query.orgId };
    }

    // Step 3: Check in headers if not found in query params
    if (req.headers['tenantid'] && req.headers['orgid']) {
      return { success: true, tenantId: req.headers['tenantid'], orgId: req.headers['orgid'] };
    }
    // Step 4: Check in user token (already decoded) if still not found
    if (decodedTokenData && decodedTokenData.tenant_id && decodedTokenData.organization_id) {
      return { success: true, tenantId: decodedTokenData.tenant_id, orgId: decodedTokenData.organization_id };
    }

    return { sucess: false };
  }

  let userRoles = userInformation.roles;

  if (performInternalAccessTokenCheck) {
    if (adminHeader) {
      if (adminHeader != process.env.ADMIN_ACCESS_TOKEN) {
        rspObj.errCode = reqMsg.ADMIN_TOKEN.INVALID_CODE;
        rspObj.errMsg = reqMsg.ADMIN_TOKEN.INVALID_CODE_MESSAGE;
        rspObj.responseCode = responseCode.unauthorized.status;
        return res.status(httpStatusCode['unauthorized'].status).send(respUtil(rspObj));
      }
      userInformation.roles.push({ title: messageConstants.common.ADMIN_ROLE });
      userRoles.push(messageConstants.common.ADMIN);

      let result = getTenantIdAndOrgIdFromTheTheReqIntoHeaders(req, decodedToken.data);

      if (!result.success) {
        rspObj.errCode = reqMsg.ADMIN_TOKEN.MISSING_CODE;
        rspObj.errMsg = reqMsg.ADMIN_TOKEN.MISSING_MESSAGE;
        rspObj.responseCode = responseCode.unauthorized.status;
        return res.status(responseCode.unauthorized.status).send(respUtil(rspObj));
      }

      req.headers['tenantid'] = result.tenantId;
      req.headers['orgid'] = result.orgId;
      let validateOrgsResult = await validateIfOrgsBelongsToTenant(req.headers['tenantid'], req.headers['orgid'],token);
      if (!validateOrgsResult.success) {
        return res.status(responseCode['unauthorized'].status).send(respUtil(validateOrgsResult.errorObj));
      }

      req.headers['orgid'] = validateOrgsResult.validOrgIds;
    } else if (userRoles.includes(messageConstants.common.TENANT_ADMIN)) {
      req.headers['tenantid'] = decodedToken.data.tenant_id.toString();

      let orgId = req.body.orgId || req.headers['orgid'];

      if (!orgId) {
        rspObj.errCode = reqMsg.ORGID.INVALID_ORGS;
        rspObj.errMsg = reqMsg.ORGID.INVALID_ORGS_MESSAGE;
        rspObj.responseCode = responseCode.unauthorized.status;
        return res.status(responseCode.unauthorized.status).send(respUtil(rspObj));
      }

      req.headers['orgid'] = orgId;

      let validateOrgsResult = await validateIfOrgsBelongsToTenant(req.headers['tenantid'], req.headers['orgid'],token);
      if (!validateOrgsResult.success) {
        return res.status(responseCode['unauthorized'].status).send(respUtil(validateOrgsResult.errorObj));
      }
      req.headers['orgid'] = validateOrgsResult.validOrgIds;
    } else if (userRoles.includes(messageConstants.common.ORG_ADMIN)) {
      req.headers['tenantid'] = userInformation.tenantId.toString();
      req.headers['orgid'] = [userInformation.organizationId.toString()];
    } else {
      rspObj.errCode = reqMsg.INVALID_ROLE.INVALID_CODE;
      rspObj.errMsg = reqMsg.INVALID_ROLE.INVALID_MESSAGE;
      rspObj.responseCode = responseCode.unauthorized.status;
      return res.status(responseCode['unauthorized'].status).send(respUtil(rspObj));
    }

    userInformation.tenantAndOrgInfo = {};
    userInformation.tenantAndOrgInfo.tenantId = req.headers['tenantid'];
    userInformation.tenantAndOrgInfo.orgId = req.headers['orgid'];
  }

  // Update user details object
  userInformation.tenantData = {};
  userInformation.tenantData.tenantId = userInformation.tenantId;
  userInformation.tenantData.orgId = userInformation.organizationId;
  req.userDetails = userInformation;

  // Helper function to access nested properties
	function getOrgId(headers, decodedToken, orgConfigData) {
		if (headers['organization_id']) {
			return (orgId = headers['organization_id'].toString())
		} else {
			const orgIdPath = orgConfigData
			return (orgId = getNestedValue(decodedToken, orgIdPath)?.toString())
		}
	}

	function getNestedValue(obj, path) {
		const parts = path.split('.')
		let current = obj

		for (const part of parts) {
			if (!current) return undefined

			// Conditional match: key[?field=value]
			const conditionalMatch = part.match(/^(\w+)\[\?(\w+)=([^\]]+)\]$/)
			if (conditionalMatch) {
				const [, arrayKey, field, expected] = conditionalMatch
				const array = current[arrayKey]
				if (!Array.isArray(array)) return undefined
				const found = array.find((item) => String(item[field]) === String(expected))
				if (!found) return undefined
				current = found
				continue
			}

			// Index match: key[0]
			const indexMatch = part.match(/^(\w+)\[(\d+)\]$/)
			if (indexMatch) {
				const [, key, index] = indexMatch
				const array = current[key]
				if (!Array.isArray(array)) return undefined
				current = array[parseInt(index, 10)]
				continue
			}

			current = current[part]
		}
		return current
	}

	function resolvePathTemplate(template, contextObject) {
		return template.replace(/\{\{(.*?)\}\}/g, (_, path) => {
			const value = getNestedValue(contextObject, path.trim())
			return value?.toString?.() ?? ''
		})
	}

  next();
};
