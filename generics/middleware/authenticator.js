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

// var tokenAuthenticationFailureMessageToSlack = function (req, token, msg) {
//   let jwtInfomration = jwtDecode(token);
//   jwtInfomration["x-authenticated-user-token"] = token;
//   const tokenByPassAllowedLog = {
//     method: req.method,
//     url: req.url,
//     headers: req.headers,
//     body: req.body,
//     errorMsg: msg,
//     customFields: jwtInfomration,
//   };
//   slackClient.sendExceptionLogMessage(tokenByPassAllowedLog);
// };

// var apiInterceptor = new ApiInterceptor(keyCloakConfig, cacheConfig);
var removedHeaders = [
  'host',
  'origin',
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
    'solutionDetails',
    '/solutions/list',
    '/programs/listByIds',
    'frameworks/delete/',
    'questions/delete/',
    'observationSubmissions/disable/',
  ];

  if (!req.rspObj) req.rspObj = {};
  var rspObj = req.rspObj;

  let token = req.headers['x-auth-token'];

  let internalAccessApiPaths = [
    'createGesture',
    'createEmoji',
    'solutionDetails',
    'solutions/updateSolutions',
    'solutions/addEntities',
    'frameworks/delete/',
    'questions/delete/',
    'observationSubmissions/disable/',
  ];

  let performInternalAccessTokenCheck = false;
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

  // let tokenCheckByPassAllowedForURL = false;
  // let tokenCheckByPassAllowedForUser = false;
  // let tokenCheckByPassAllowedUserDetails = {};
  // if (
  //   process.env.DISABLE_TOKEN_ON_OFF &&
  //   process.env.DISABLE_TOKEN_ON_OFF === "ON" &&
  //   process.env.DISABLE_TOKEN_CHECK_FOR_API &&
  //   process.env.DISABLE_TOKEN_CHECK_FOR_API != ""
  // ) {
  //   process.env.DISABLE_TOKEN_CHECK_FOR_API.split(",").forEach(
  //     (allowedEndpoints) => {
  //       if (req.path.includes(allowedEndpoints)) {
  //         tokenCheckByPassAllowedForURL = true;
  //         let allowedUsersPath = "DISABLE_TOKEN_" + allowedEndpoints + "_USERS";
  //         if (
  //           process.env[allowedUsersPath] &&
  //           process.env[allowedUsersPath] == "ALL"
  //         ) {
  //           tokenCheckByPassAllowedForUser = true;
  //           tokenCheckByPassAllowedUserDetails = {
  //             id: process.env.DISABLE_TOKEN_DEFAULT_USERID,
  //             userId: process.env.DISABLE_TOKEN_DEFAULT_USERID,
  //             roles: [process.env.DISABLE_TOKEN_DEFAULT_USER_ROLE],
  //             name: process.env.DISABLE_TOKEN_DEFAULT_USER_NAME,
  //             email: process.env.DISABLE_TOKEN_DEFAULT_USER_EMAIL,
  //           };
  //         } else if (process.env[allowedUsersPath]) {
  //           let jwtInfo = jwtDecode(token);
  //           process.env[allowedUsersPath].split(",").forEach((allowedUser) => {
  //             if (allowedUser == jwtInfo.sub) {
  //               tokenCheckByPassAllowedForUser = true;
  //               tokenCheckByPassAllowedUserDetails = {
  //                 id: jwtInfo.sub,
  //                 userId: jwtInfo.sub,
  //                 roles: [process.env.DISABLE_TOKEN_DEFAULT_USER_ROLE],
  //                 name: jwtInfo.name,
  //                 email: jwtInfo.email,
  //               };
  //             }
  //           });
  //         }
  //       }
  //     }
  //   );
  // }

  let decodedToken = null
	try {
		if (process.env.AUTH_METHOD === messageConstants.common.AUTH_METHOD.NATIVE) {
			try {
				// If using native authentication, verify the JWT using the secret key
				decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
			} catch (err) {
				// If verification fails, send an unauthorized response
        rspObj.errCode = reqMsg.TOKEN.MISSING_CODE;
        rspObj.errMsg = reqMsg.TOKEN.MISSING_MESSAGE;
        rspObj.responseCode = responseCode.unauthorized.status;
				return res.status(responseCode['unauthorized'].status).send(respUtil(rspObj))
			}
		} else if (process.env.AUTH_METHOD === messageConstants.common.AUTH_METHOD.KEYCLOAK_PUBLIC_KEY) {
			// If using Keycloak with a public key for authentication
			const keycloakPublicKeyPath = `${process.env.KEYCLOAK_PUBLIC_KEY_PATH}/`
			const PEM_FILE_BEGIN_STRING = '-----BEGIN PUBLIC KEY-----'
			const PEM_FILE_END_STRING = '-----END PUBLIC KEY-----'

			// Decode the JWT to extract its claims without verifying
			const tokenClaims = jwt.decode(token, { complete: true })

			if (!tokenClaims || !tokenClaims.header) {
				// If the token does not contain valid claims or header, send an unauthorized response
        rspObj.errCode = reqMsg.TOKEN.MISSING_CODE;
        rspObj.errMsg = reqMsg.TOKEN.MISSING_MESSAGE;
        rspObj.responseCode = responseCode.unauthorized.status;
				return res.status(responseCode['unauthorized'].status).send(respUtil(rspObj))
			}

			// Extract the key ID (kid) from the token header
			const kid = tokenClaims.header.kid
			// Construct the path to the public key file using the key ID
			let filePath = path.resolve(__dirname, keycloakPublicKeyPath, kid.replace(/\.\.\//g, ''))
			// Read the public key file from the resolved file path
			const accessKeyFile = await fs.promises.readFile(filePath, 'utf8')
			// Ensure the public key is properly formatted with BEGIN and END markers
			const cert = accessKeyFile.includes(PEM_FILE_BEGIN_STRING)
				? accessKeyFile
				: `${PEM_FILE_BEGIN_STRING}\n${accessKeyFile}\n${PEM_FILE_END_STRING}`

			let verifiedClaims
			try {
				// Verify the JWT using the public key and specified algorithms
				verifiedClaims = jwt.verify(token, cert, { algorithms: ['sha1', 'RS256', 'HS256'] })
			} catch (err) {
				// If the token is expired or any other error occurs during verification
				if (err.name === 'TokenExpiredError') {
          rspObj.errCode = reqMsg.TOKEN.INVALID_CODE;
          rspObj.errMsg = reqMsg.TOKEN.INVALID_MESSAGE;
          rspObj.responseCode = responseCode.unauthorized.status;
					return res.status(responseCode['unauthorized'].status).send(respUtil(rspObj))
				}
			}

			// Extract the external user ID from the verified claims
			const externalUserId = verifiedClaims.sub.split(':').pop()

			const data = {
				id: externalUserId,
				roles: [], // this is temporariy set to an empty array, it will be corrected soon...
				name: verifiedClaims.name,
				organization_id: verifiedClaims.org || null,
			}

			// Ensure decodedToken is initialized as an object
			decodedToken = decodedToken || {}
			decodedToken['data'] = data
		}
	} catch (err) {
    rspObj.errCode = reqMsg.TOKEN.MISSING_CODE;
    rspObj.errMsg = reqMsg.TOKEN.MISSING_MESSAGE;
    rspObj.responseCode = responseCode.unauthorized.status;
		return res.status(responseCode['unauthorized'].status).send(respUtil(rspObj))
	}
	if (!decodedToken) {
    rspObj.errCode = reqMsg.TOKEN.MISSING_CODE;
    rspObj.errMsg = reqMsg.TOKEN.MISSING_MESSAGE;
    rspObj.responseCode = responseCode.unauthorized.status;
		return res.status(responseCode['unauthorized'].status).send(respUtil(rspObj))
	}

  // Path to config.json
  const configFilePath = path.resolve(__dirname, '../../', 'config.json');
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

  let userInformation = {};
  // Create user details to request
  req.userDetails = {
    userToken: token,
  };
  // performing default token data extraction
  if (defaultTokenExtraction) {
    userInformation = {
      userToken: token,
      userId: typeof decodedToken.data.id == 'string' ? decodedToken.data.id : JSON.stringify(decodedToken.data.id),
      userName: decodedToken.data.name,
      firstName: decodedToken.data.name,
      organizationId: decodedToken.data.organization_id,
      orgId: decodedToken.data.organization_id.toString(),
      tenantId: decodedToken.tenantId && decodedToken.tenantId.toString() || '6',
      tenantData:{
        orgId:decodedToken.data.organization_id.toString(),
        tenantId:decodedToken.tenantId && decodedToken.tenantId.toString() || '6',
      }
    };
  } else {
    // Iterate through each key in the config object
    for (let key in configData) {
      if (configData.hasOwnProperty(key)) {
        let keyValue = getNestedValue(decodedToken, configData[key]);
        if (key === 'userId') {
          keyValue = keyValue.toString();
        }
        // For each key in config, assign the corresponding value from decodedToken
        userInformation[key] = keyValue;
      }
    }
  }

    const isAdmin = req.get('admin_access_token') === process.env.ADMIN_ACCESS_TOKEN;
    console.log(isAdmin, 'isAdmin')
    if (isAdmin) {

    // Validate the presence of required headers
    const adminOrgId = req.get('admin_org_id');
    const adminTenantId = req.get('admin_tenant_id');

    if (!adminOrgId || !adminTenantId) {
      rspObj.errCode = 'ADMIN_FIELDS_MISSING';
      rspObj.errMsg = "Required headers are missing: admin_org_id or admin_tenant_id";
      rspObj.responseCode = responseCode.unauthorized.status;
      return res.status(responseCode.unauthorized.status).send(respUtil(rspObj));
    }

    // If the user is an admin, override tenantId and orgId with values from the headers
    userInformation.orgId = req.get('admin_org_id').toString();
    userInformation.tenantId = (req.get('admin_tenant_id') && req.get('admin_tenant_id').toString()) || '1';
    userInformation.tenantData.orgId = req.get('admin_org_id').toString();
    userInformation.tenantData.tenantId = (req.get('admin_tenant_id') && req.get('admin_tenant_id').toString()) || '1';
    }

  // Update user details object
  req.userDetails = userInformation;

  console.log(req.userDetails,'<===req.userDetails')

  // Helper function to access nested properties
  function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  // let userDetails = await getUserDetails(decodedToken)
  /*
  req.userDetails = {
    userToken: token,
    userId: JSON.stringify(decodedToken.data.id),
    userName: decodedToken.data.name,
    // email: decodedToken.data.email,
    firstName: decodedToken.data.name,
    organizationId: decodedToken.data.organization_id,
  };
  */
  next();

  // if (!token) {
  //   rspObj.errCode = reqMsg.TOKEN.MISSING_CODE;
  //   rspObj.errMsg = reqMsg.TOKEN.MISSING_MESSAGE;
  //   rspObj.responseCode = responseCode.unauthorized.status;
  //   return res.status(401).send(respUtil(rspObj));
  // }

  // apiInterceptor.validateToken(token, function (err, tokenData) {
  //   // console.error(err, tokenData, rspObj);

  //   if (
  //     err &&
  //     tokenCheckByPassAllowedForURL &&
  //     tokenCheckByPassAllowedForUser
  //   ) {
  //     req.rspObj.userId = tokenCheckByPassAllowedUserDetails.userId;
  //     req.rspObj.userToken = req.headers["x-authenticated-user-token"];
  //     delete req.headers["x-authenticated-userid"];
  //     delete req.headers["x-authenticated-user-token"];
  //     req.headers["x-authenticated-userid"] =
  //       tokenCheckByPassAllowedUserDetails.userId;
  //     req.rspObj = rspObj;
  //     req.userDetails = tokenCheckByPassAllowedUserDetails;
  //     req.userDetails.userToken = req.rspObj.userToken;
  //     req.userDetails.allRoles = tokenCheckByPassAllowedUserDetails.roles;

  //     tokenAuthenticationFailureMessageToSlack(
  //       req,
  //       token,
  //       "TOKEN BYPASS ALLOWED"
  //     );
  //     next();
  //     return;
  //   }

  //   if (err) {
  //     rspObj.errCode = reqMsg.TOKEN.INVALID_CODE;
  //     rspObj.errMsg = reqMsg.TOKEN.INVALID_MESSAGE;
  //     rspObj.responseCode = responseCode.unauthorized.status;
  //     tokenAuthenticationFailureMessageToSlack(
  //       req,
  //       token,
  //       "TOKEN VERIFICATION WITH KEYCLOAK FAILED"
  //     );
  //     return res.status(401).send(respUtil(rspObj));
  //   } else {
  //     req.rspObj.userId = tokenData.userId;
  //     req.rspObj.userToken = req.headers["x-authenticated-user-token"];
  //     delete req.headers["x-authenticated-userid"];
  //     delete req.headers["x-authenticated-user-token"];
  //     // rspObj.telemetryData.actor = utilsService.getTelemetryActorData(req);
  //     req.headers["x-authenticated-userid"] = tokenData.userId;
  //     req.rspObj = rspObj;
  //     shikshalokam
  //       .userInfo(token, tokenData.userId)
  //       .then(async (userDetails) => {
  //         if (userDetails.responseCode == "OK") {
  //           req.userDetails = userDetails.result.response;
  //           req.userDetails.userToken = req.rspObj.userToken;
  //           req.userDetails.allRoles = await getAllRoles(req.userDetails);
  //           next();
  //         } else {
  //           tokenAuthenticationFailureMessageToSlack(
  //             req,
  //             token,
  //             "TOKEN VERIFICATION - FAILED TO GET USER DETAIL FROM LEARNER SERVICE"
  //           );
  //           rspObj.errCode = reqMsg.TOKEN.INVALID_CODE;
  //           rspObj.errMsg = reqMsg.TOKEN.INVALID_MESSAGE;
  //           rspObj.responseCode = responseCode.unauthorized.status;
  //           return res.status(401).send(respUtil(rspObj));
  //         }
  //       })
  //       .catch((error) => {
  //         tokenAuthenticationFailureMessageToSlack(
  //           req,
  //           token,
  //           "TOKEN VERIFICATION - ERROR FETCHING USER DETAIL FROM LEARNER SERVICE"
  //         );
  //         return res.status(401).send(error);
  //       });
  //   }
  // });
};
