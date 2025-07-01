const { validate: uuidValidate, v4: uuid } = require('uuid');
const md5 = require('md5');

function camelCaseToTitleCase(in_camelCaseString) {
  var result = in_camelCaseString // "ToGetYourGEDInTimeASongAboutThe26ABCsIsOfTheEssenceButAPersonalIDCardForUser456InRoom26AContainingABC26TimesIsNotAsEasyAs123ForC3POOrR2D2Or2R2D"
    .replace(/([a-z])([A-Z][a-z])/g, '$1 $2') // "To Get YourGEDIn TimeASong About The26ABCs IsOf The Essence ButAPersonalIDCard For User456In Room26AContainingABC26Times IsNot AsEasy As123ForC3POOrR2D2Or2R2D"
    .replace(/([A-Z][a-z])([A-Z])/g, '$1 $2') // "To Get YourGEDIn TimeASong About The26ABCs Is Of The Essence ButAPersonalIDCard For User456In Room26AContainingABC26Times Is Not As Easy As123ForC3POOr R2D2Or2R2D"
    .replace(/([a-z])([A-Z]+[a-z])/g, '$1 $2') // "To Get Your GEDIn Time ASong About The26ABCs Is Of The Essence But APersonal IDCard For User456In Room26AContainingABC26Times Is Not As Easy As123ForC3POOr R2D2Or2R2D"
    .replace(/([A-Z]+)([A-Z][a-z][a-z])/g, '$1 $2') // "To Get Your GEDIn Time A Song About The26ABCs Is Of The Essence But A Personal ID Card For User456In Room26A ContainingABC26Times Is Not As Easy As123ForC3POOr R2D2Or2R2D"
    .replace(/([a-z]+)([A-Z0-9]+)/g, '$1 $2') // "To Get Your GEDIn Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456In Room 26A Containing ABC26Times Is Not As Easy As 123For C3POOr R2D2Or 2R2D"

    // Note: the next regex includes a special case to exclude plurals of acronyms, e.g. "ABCs"
    .replace(/([A-Z]+)([A-Z][a-rt-z][a-z]*)/g, '$1 $2') // "To Get Your GED In Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456In Room 26A Containing ABC26Times Is Not As Easy As 123For C3PO Or R2D2Or 2R2D"
    .replace(/([0-9])([A-Z][a-z]+)/g, '$1 $2') // "To Get Your GED In Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456In Room 26A Containing ABC 26Times Is Not As Easy As 123For C3PO Or R2D2Or 2R2D"

    // Note: the next two regexes use {2,} instead of + to add space on phrases like Room26A and 26ABCs but not on phrases like R2D2 and C3PO"
    .replace(/([A-Z]{2,})([0-9]{2,})/g, '$1 $2') // "To Get Your GED In Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456 In Room 26A Containing ABC 26 Times Is Not As Easy As 123 For C3PO Or R2D2 Or 2R2D"
    .replace(/([0-9]{2,})([A-Z]{2,})/g, '$1 $2') // "To Get Your GED In Time A Song About The 26 ABCs Is Of The Essence But A Personal ID Card For User 456 In Room 26A Containing ABC 26 Times Is Not As Easy As 123 For C3PO Or R2D2 Or 2R2D"
    .trim();

  // capitalize the first letter
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function lowerCase(str) {
  return str.toLowerCase();
}

function checkIfStringIsUrl(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return pattern.test(str);
}

function generateRandomCharacters(numberOfChar) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789!@#%&*';
  for (var i = 0; i < numberOfChar; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function getCriteriaIds(themes) {
  let allCriteriaIds = [];
  themes.forEach((theme) => {
    let criteriaIdArray = [];
    if (theme.children) {
      criteriaIdArray = this.getCriteriaIds(theme.children);
    } else {
      criteriaIdArray = theme.criteria;
    }
    criteriaIdArray.forEach((eachCriteria) => {
      if (eachCriteria.criteriaId) {
        allCriteriaIds.push(eachCriteria.criteriaId);
      } else {
        allCriteriaIds.push(eachCriteria);
      }
    });
  });
  return allCriteriaIds;
}

function getCriteriaIdsAndWeightage(themes) {
  let allCriteriaIds = [];
  themes.forEach((theme) => {
    let criteriaIdArray = [];
    if (theme.children) {
      criteriaIdArray = this.getCriteriaIdsAndWeightage(theme.children);
    } else {
      criteriaIdArray = theme.criteria;
    }
    criteriaIdArray.forEach((eachCriteria) => {
      allCriteriaIds.push({
        criteriaId: eachCriteria.criteriaId,
        weightage: eachCriteria.weightage,
      });
    });
  });
  return allCriteriaIds;
}

function getUserRole(userDetails, caseSensitive = false) {
  if (userDetails && userDetails.allRoles.length) {
    _.pull(userDetails.allRoles, 'PUBLIC');
    let role = userDetails.allRoles[0];
    if (caseSensitive == true) {
      return mapUserRole(role);
    }
    return role;
  } else {
    return;
  }
}

function getReadableUserRole(userDetails) {
  if (userDetails && userDetails.allRoles.length) {
    _.pull(userDetails.allRoles, 'PUBLIC');

    let readableRoles = {
      ASSESSOR: 'Assessors',
      LEAD_ASSESSOR: 'Lead Assessors',
      PROJECT_MANAGER: 'Project Managers',
      PROGRAM_MANAGER: 'Program Managers',
    };

    return readableRoles[userDetails.allRoles[0]] || '';
  } else {
    return;
  }
}

function fetchAssessorsLeadAssessorRole() {
  return ['LEAD_ASSESSOR', 'ASSESSOR'];
}

function mapUserRole(role) {
  let allRoles = assessmentRoles();
  return allRoles[role];
}

function assessmentRoles() {
  let allRoles = {
    ASSESSOR: 'assessors',
    LEAD_ASSESSOR: 'leadAssessors',
    PROJECT_MANAGER: 'projectManagers',
    PROGRAM_MANAGER: 'programManagers',
  };
  return allRoles;
}

function getAllQuestionId(criteria) {
  let questionIds = [];
  criteria.forEach((eachCriteria) => {
    eachCriteria.evidences.forEach((eachEvidence) => {
      eachEvidence.sections.forEach((eachSection) => {
        eachSection.questions.forEach((eachQuestion) => {
          questionIds.push(eachQuestion);
        });
      });
    });
  });
  return questionIds;
}

function valueParser(dataToBeParsed) {
  let parsedData = {};

  Object.keys(dataToBeParsed).forEach((eachDataToBeParsed) => {
    parsedData[eachDataToBeParsed] = dataToBeParsed[eachDataToBeParsed].trim();
  });

  if (parsedData._arrayFields && parsedData._arrayFields.split(',').length > 0) {
    parsedData._arrayFields.split(',').forEach((arrayTypeField) => {
      if (parsedData[arrayTypeField]) {
        parsedData[arrayTypeField] = parsedData[arrayTypeField].split(',');
      }
    });
  }

  return parsedData;
}

/**
 * check the uuid is valid
 * @function
 * @name checkIfValidUUID
 * @returns {String} returns boolean.
 */

 function checkIfValidUUID(value) {
  const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(value);
 }
/**
 * filter out location id and code
 * @function
 * @name filterLocationIdandCode
 * @returns {Object} - Object contain locationid and location code array.
 */

function filterLocationIdandCode(dataArray) {
  let locationIds = [];
  let locationCodes = [];
  dataArray.forEach((element) => {
    if (this.checkIfValidUUID(element)) {
      locationIds.push(element);
    } else {
      locationCodes.push(element);
    }
  });
  return {
    ids: locationIds,
    codes: locationCodes,
  };
}
  /**
 * Converts an array of IDs into an array of `ObjectId` instances.
 */
function arrayIdsTobjectIds(ids) {
  /**
 * Converts an array of IDs into an array of `ObjectId` instances.
 */
  return ids.map((id) => new ObjectId(id));
}
/**
 * Converts an array of string IDs to an array of ObjectId instances
 * 
 * This function is created as a new implementation that uses the 'new' keyword
 * with ObjectId. It's separate from the original arrayIdsTobjectIds function
 * to avoid affecting other parts of the codebase that rely on the original implementation.
 * 
 * @param {string[]} ids - An array of string IDs to be converted
 * @returns {ObjectId[]} An array of ObjectId instances
 */
function arrayIdsTobjectIdsNew(ids) {
  return ids.map((id) => new ObjectId(id));
}
function arrayOfObjectToArrayOfObjectId(ids) {
	return ids.map((obj) => obj._id)
}
function checkIfEnvDataExistsOrNot(data) {
  let value;

  if (process.env[data] && process.env[data] !== '') {
    value = process.env[data];
  } else {
    let defaultEnv = 'DEFAULT_' + data;
    value = process.env[defaultEnv];
  }

  return value;
}

/**
 * Get epoch time from current date.
 * @function
 * @name epochTime
 * @returns {Date} returns epoch time.
 */

function epochTime() {
  var currentDate = new Date();
  currentDate = currentDate.getTime();
  return currentDate;
}

/**
 * check whether id is mongodbId or not.
 * @function
 * @name isValidMongoId
 * @param {String} id
 * @returns {Boolean} returns whether id is valid mongodb id or not.
 */

function isValidMongoId(id) {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}

/**
 * generate uuid
 * @function
 * @name generateUUId
 * @returns {String} returns uuid.
 */

function generateUUId() {
  return uuid();
}

/**
 * md5 hash
 * @function
 * @name md5Hash
 * @returns {String} returns uuid.
 */

function md5Hash(value) {
  return md5(value);
}

/**
 * Remove duplicates from array
 * @function
 * @name removeDuplicatesFromArray
 * @returns {Array}  returns unique data in array.
 */

function removeDuplicatesFromArray(data, key) {
  let uniqueArray = [];
  let newMap = new Map();

  uniqueArray = data.filter((singleData) => {
    const element = newMap.get(singleData[key].toString());
    if (!element) {
      newMap.set(singleData[key].toString(), singleData);
      return true;
    } else {
      return false;
    }
  });

  return uniqueArray;
}

function convertStringToBoolean(stringData) {
  let stringToBoolean = stringData === 'TRUE' || stringData === 'true';
  return stringToBoolean;
}

/**
 * Convert string to mongodb object id.
 * @method
 * @name convertStringToObjectId
 * @param id - string id
 * @returns {ObjectId} - returns objectId
 */

function convertStringToObjectId(id) {
  let checkWhetherIdIsValidMongoId = gen.utils.isValidMongoId(id);
  if (checkWhetherIdIsValidMongoId) {
    id = new ObjectId(id);
  }

  return id;
}
/**
 * Returns endDate if time is not passed it will add default time with offset to utc
 * @function
 * @name getEndDate
 * @returns {date} returns date and time with offset
 * example:
 * input = 2024-06-16, +05:30
 * output = Sun Jun 16 2024 18:29:59 GMT+0000 (Coordinated Universal Time)
 */
function getEndDate(date, timeZoneDifference) {
  let endDate = date.split(' ');
  if (endDate[1] === '' || endDate[1] === undefined) {
    date = endDate[0] + ' 23:59:59';
  }
  date = new Date(date);
  date = addOffsetToDateTime(date, timeZoneDifference);
  return date;
}

/**
 * Returns startDate if time is not passed it will add default time with offset to utc
 * @function
 * @name getStartDate
 * @returns {date} returns date and time with offset
 * example:
 * input = 2022-06-01, +05:30
 * output = Wed Jan 31 2001 18:30:00 GMT+0000 (Coordinated Universal Time)
 */
function getStartDate(date, timeZoneDifference) {
  let startDate = date.split(' ');
  if (startDate[1] === '' || startDate[1] === undefined) {
    date = startDate[0] + ' 00:00:00';
  }
  date = new Date(date);
  date = addOffsetToDateTime(date, timeZoneDifference);
  return date;
}
/**
 * Returns date and time with offset
 * @function
 * @name addOffsetToDateTime
 * @returns {date} returns date and time with offset
 * example:
 * input = Sun Jun 16 2024 23:59:59 GMT+0000 (Coordinated Universal Time), +05:30
 * output = Sun Jun 16 2024 18:29:59 GMT+0000 (Coordinated Universal Time)
 */

function addOffsetToDateTime(time, timeZoneDifference) {
  //get the offset time from env with respect UTC
  let localTimeZone = timeZoneDifference;
  //convert offset time to minutes
  let localTime = localTimeZone.split(':');
  let localHourDifference = Number(localTime[0]);
  let getTimeDiffInMinutes =
    localHourDifference * 60 + (localHourDifference / Math.abs(localHourDifference)) * Number(localTime[1]);
  //get server offset time w.r.t. UTC time
  let timeDifference = new Date().getTimezoneOffset();
  //get actual time difference in minutes
  let differenceWithLocal = timeDifference + getTimeDiffInMinutes;
  // if its 0 then return same time
  if (differenceWithLocal === 0) {
    return time;
  } else {
    // set time difference
    let getMinutes = differenceWithLocal % 60;
    let getHours = (differenceWithLocal - getMinutes) / 60;
    time.setHours(time.getHours() - getHours);
    time.setMinutes(time.getMinutes() - getMinutes);
    return time;
  }
}

/**
 * check whether string is valid uuid.
 * @function
 * @name checkValidUUID
 * @param {String} uuids
 * @returns {Boolean} returns a Boolean value true/false
 */

function checkValidUUID(uuids) {
  var validateUUID = true;
  if (Array.isArray(uuids)) {
    for (var i = 0; uuids.length > i; i++) {
      if (!uuidValidate(uuids[i])) {
        validateUUID = false;
      }
    }
  } else {
    validateUUID = uuidValidate(uuids);
  }
  return validateUUID;
}

 
/**
 * check whether string contains only number
 * @function
 * @name checkIfStringIsNumber
 * @returns {Boolean} returns a Boolean value true/false
 */

function checkIfStringIsNumber(str) {
  return /^[0-9]+$/.test(str);
}
/**
  * Return Gotenberg service connection string
  * @function
  * @name getGotenbergConnection
  * @returns {Array}  returns gotenberg server connection.  
*/

function getGotenbergConnection() {

  let options = {
    method: "POST",
    uri: process.env.GOTENBERG_URL + "/forms/chromium/convert/html",
    headers: {
      'Content-Type': 'application/octet-stream',
  },
    resolveWithFullResponse: true,
    encoding: null,
    json: true,
    formData: "",
  
  }

  return options;
}
/**
 * Returns array of objects in string format and accepts array of objectId
 * @function
 * @name convertArrayObjectIdtoStringOfObjectId
 * @returns {Boolean} returns a array of objectIds in string format
 * Input = [ObjectId(6319a4d53c40dd000978dacb), ObjectId(6319a4d53c40dd000978dacb)] This array will contain buffer of objectId
 * Output = ["6319a4d53c40dd000978dacb","6319a4d53c40dd000978dacb"] This is the output in format of string
 */

function convertArrayObjectIdtoStringOfObjectId(ids) {
  return ids.map((obj) => obj._id.toString());
}

/**
 * Generate getting chart color code.
 * @method
 * @name getColorForLevel
 * @param {String} level     - Domain Levels.
 * @returns {String}         -Color code for a chart
 */
function getColorForLevel(level) {
  let colors = {
    L1: 'rgb(255, 99, 132)',
    L2: 'rgb(54, 162, 235)',
    L3: 'rgb(255, 206, 86)',
    L4: 'rgb(75, 192, 192)',
  };
  return colors[level] || 'rgb(201, 203, 207)';
}

/**
 * Returns Tenant Data from the token
 * @method
 * @name returnTenantDataFromToken
 * @param {Object} userDetails     - takes userDetails object.
 * @returns {Object}  - returns formated tenant data.
 */
function returnTenantDataFromToken(userDetails) {
  let tenantData = {};
  tenantData.tenantId = userDetails.tenantId;
  tenantData.orgId = userDetails.organizationId
  return tenantData
}


/**
 * Generates a MongoDB query filter based on factor scopes and user role information.
 *
 * @param {string[]} factors - An array of factor names used to construct scoped keys.
 * @param {Object.<string, string|string[]>} userRoleInfo - An object where keys are factor names and values are either comma-separated strings or arrays of values.
 * @returns {Object[]} An array of query filter objects for MongoDB.
 */
function factorQuery(factors, userRoleInfo) {
  let queryFilter = [];

  for (let idx = 0; idx < factors.length; idx++) {
    let factor = factors[idx];
    let scope = 'scope.' + factor;
    let rawValues = userRoleInfo[factor];
    let valueArray;

    if (rawValues === undefined || rawValues === null) {
      valueArray = [messageConstants.common.ALL_SCOPE_VALUE];
    } else if (Array.isArray(rawValues)) {
      valueArray = [...rawValues, messageConstants.common.ALL_SCOPE_VALUE];
    } else if (typeof rawValues === 'string') {
      const splitValues = rawValues
        .split(',')
        .map(v => v.trim())
        .filter(Boolean);
      valueArray = [...splitValues, messageConstants.common.ALL_SCOPE_VALUE];
    }

    queryFilter.push({ [scope]: { $in: valueArray } });
  }

  return queryFilter;
}
/**
 * Checks if the user has admin-level roles.
 * @param {string[]} roles - Array of user role strings.
 * @param {string[]} roleToCheck - Array of user role to validate strings.
 * @returns {boolean} True if user has ADMIN or TENANT_ADMIN role, else false.
 */
function validateRoles(roles,roleToCheck){
  return roles.some((role) =>
    roleToCheck.includes(role)
  )
}

/**
 * Extracts mandatory and optional scope factors from tenant metadata.
 *
 * @param {Object} tenantMeta - Metadata object containing scope configuration fields.
 * @param {string} mandatoryKey - Key name in tenantMeta for mandatory scope fields.
 * @param {string} optionalKey - Key name in tenantMeta for optional scope fields.
 * @returns {{ mandatoryFactors: string[], optionalFactors: string[] }} 
 *          An object containing arrays of mandatory and optional factors.
 */
function extractScopeFactors(tenantMeta, mandatoryKey, optionalKey) {
  const factors = [];
  const optionalFactors = [];

  if (
    tenantMeta.hasOwnProperty(mandatoryKey) &&
    Array.isArray(tenantMeta[mandatoryKey]) &&
    tenantMeta[mandatoryKey].length > 0
  ) {
    factors.push(...tenantMeta[mandatoryKey]);
  }

  if (
    tenantMeta.hasOwnProperty(optionalKey) &&
    Array.isArray(tenantMeta[optionalKey]) &&
    tenantMeta[optionalKey].length > 0
  ) {
    optionalFactors.push(...tenantMeta[optionalKey]);
  }

  return {
    mandatoryFactors: factors,
    optionalFactors: optionalFactors
  };
}
/**
 * Generates a MongoDB filter query with optional conditions ($or) always nested inside $and.
 *
 * @param {Object} bodyData - The data to evaluate against factors.
 * @param {Object} tenantMeta - Metadata containing scope definitions.
 * @param {Array<string>} mandatoryField - List of mandatory scope fields.
 * @param {Array<string>} optionalField - List of optional scope fields.
 * @returns {Object} MongoDB filter query.
 */
function targetingQuery(bodyData, tenantMeta, mandatoryField, optionalField) {

  let { mandatoryFactors, optionalFactors } = extractScopeFactors(
    tenantMeta,
    mandatoryField,
    optionalField
  );

  const andClauses = [];

  // Add mandatory conditions if any
  if (Array.isArray(mandatoryFactors) && mandatoryFactors.length > 0) {
    const mandatoryQuery = gen.utils.factorQuery(mandatoryFactors, bodyData);
    if (Array.isArray(mandatoryQuery) && mandatoryQuery.length > 0) {
      andClauses.push(...mandatoryQuery);
    }
  }

  // Add optional conditions as $or inside $and
  if (Array.isArray(optionalFactors) && optionalFactors.length > 0) {
    const optionalQuery = gen.utils.factorQuery(optionalFactors, bodyData);
    if (Array.isArray(optionalQuery) && optionalQuery.length > 0) {
      andClauses.push({ $or: optionalQuery });
    }
  }

  let filterQuery = andClauses.length > 0 ? { $and: andClauses } : {};

  return filterQuery;
}
/**
 * Filters and formats the scope data based on tenant metadata.
 *
 * - Only includes fields defined in mandatory and optional scope fields.
 * - Mandatory fields are always included: if not present or falsy in scopeData, defaults to ['ALL'].
 * - Optional fields are included only if present and truthy in scopeData.
 *
 * @param {Object} scopeData - The input scope object with field values.
 * @param {Object} tenantPublicDetailsMetaField - Metadata defining mandatory and optional scope fields.
 * @param {Object} messageConstants - Constants object containing ALL_SCOPE_VALUE and field keys.
 * @returns {Object} - The filtered scope object with valid fields and values.
 */
function getFilteredScope(scopeData, tenantPublicDetailsMetaField) {
  const mandatoryFields = tenantPublicDetailsMetaField[messageConstants.common.MANDATORY_SCOPE_FIELD] || [];
  const optionalFields = tenantPublicDetailsMetaField[messageConstants.common.OPTIONAL_SCOPE_FIELD] || [];
  
  const allAllowedFields = [...mandatoryFields, ...optionalFields];
  const filteredScope = {};

  for (const field of allAllowedFields) {
    const value = scopeData[field];

    if (value) {
      filteredScope[field] = value;
    } else if (mandatoryFields.includes(field)) {
      filteredScope[field] = [messageConstants.common.ALL_SCOPE_VALUE];
    }
  }

  return filteredScope;
}




module.exports = {
  camelCaseToTitleCase: camelCaseToTitleCase,
  lowerCase: lowerCase,
  checkIfStringIsUrl: checkIfStringIsUrl,
  generateRandomCharacters: generateRandomCharacters,
  getCriteriaIds: getCriteriaIds,
  getUserRole: getUserRole,
  getReadableUserRole: getReadableUserRole,
  mapUserRole: mapUserRole,
  valueParser: valueParser,
  getAllQuestionId: getAllQuestionId,
  getCriteriaIdsAndWeightage: getCriteriaIdsAndWeightage,
  assessmentRoles: assessmentRoles,
  arrayIdsTobjectIds: arrayIdsTobjectIds,
  checkIfEnvDataExistsOrNot: checkIfEnvDataExistsOrNot,
  checkIfStringIsNumber: checkIfStringIsNumber,
  fetchAssessorsLeadAssessorRole: fetchAssessorsLeadAssessorRole,
  epochTime: epochTime,
  isValidMongoId: isValidMongoId,
  generateUUId: generateUUId,
  md5Hash: md5Hash,
  removeDuplicatesFromArray: removeDuplicatesFromArray,
  convertStringToBoolean: convertStringToBoolean,
  filterLocationIdandCode: filterLocationIdandCode,
  checkValidUUID: checkValidUUID,
  convertStringToObjectId: convertStringToObjectId,
  arrayIdsTobjectIdsNew: arrayIdsTobjectIdsNew,
  getEndDate: getEndDate,
  getStartDate: getStartDate,
  checkIfValidUUID:checkIfValidUUID,
  getGotenbergConnection:getGotenbergConnection,
  arrayOfObjectToArrayOfObjectId:arrayOfObjectToArrayOfObjectId,
  convertArrayObjectIdtoStringOfObjectId:convertArrayObjectIdtoStringOfObjectId,
  getColorForLevel:getColorForLevel,
  returnTenantDataFromToken:returnTenantDataFromToken,
  factorQuery:factorQuery,
  validateRoles:validateRoles,
  extractScopeFactors:extractScopeFactors,
  targetingQuery:targetingQuery,
  getFilteredScope:getFilteredScope,
};
