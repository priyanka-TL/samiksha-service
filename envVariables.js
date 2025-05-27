let table = require('cli-table');

let tableData = new table();

let enviromentVariables = {
  HOST: {
    message: 'Required host name',
    optional: false,
  },
  PORT: {
    message: 'Required port no',
    optional: false,
  },
  LOG: {
    message: 'Required logger type',
    optional: false,
  },
  NODE_ENV: {
    message: 'Required node environment',
    optional: false,
  },
  // ENABLE_BUNYAN_LOGGING: {
  //   message: 'Enable or disable bunyan logging',
  //   optional: false,
  // },
  REQUEST_TIMEOUT_FOR_REPORTS: {
    message: 'Required Reports request timeout',
    optional: false,
  },
  APPLICATION_BASE_URL: {
    message: 'Required Application base url',
    optional: false,
  },
  MOBILE_APPLICATION_APP_TYPE: {
    message: 'Required mobile application app type value',
    optional: false,
  },

  // AUTHORIZATION: {
  //   message: 'Required Server authorization code',
  //   optional: false,
  // },
  // CLOUD_STORAGE: {
  //   message: 'Required cloud storage provider',
  //   optional: false,
  // },
  // GCP_PATH: {
  //   message: 'Optional google cloud platform path',
  //   optional: true,
  // },
  // GCP_BUCKET_NAME: {
  //   message: 'Optional gcp bucket name',
  //   optional: true,
  // },
  // AZURE_ACCOUNT_NAME: {
  //   message: 'Optional azure account name',
  //   optional: true,
  // },
  // AZURE_ACCOUNT_KEY: {
  //   message: 'Optional azure storage account key',
  //   optional: true,
  // },
  // AZURE_STORAGE_CONTAINER: {
  //   message: 'Optional azure storage container name',
  //   optional: true,
  // },
  // AWS_ACCESS_KEY_ID: {
  //   message: 'Optional aws access key id',
  //   optional: true,
  // },
  // AWS_SECRET_ACCESS_KEY: {
  //   message: 'Optional aws secret access key',
  //   optional: true,
  // },
  // AWS_BUCKET_NAME: {
  //   message: 'Optional aws bucket name',
  //   optional: true,
  // },
  // AWS_BUCKET_REGION: {
  //   message: 'Optional aws bucket region',
  //   optional: true,
  // },
  // AWS_BUCKET_ENDPOINT: {
  //   message: 'Optional aws bucket endpoint',
  //   optional: true,
  // },
  MONGODB_URL: {
    message: 'Required mongodb url',
    optional: false,
  },
  // SHIKSHALOKAM_BASE_HOST: {
  //   message: 'Required shikshalokam base host',
  //   optional: false,
  // },
  DB: {
    message: 'Required database',
    optional: false,
  },
  INTERNAL_ACCESS_TOKEN: {
    message: 'Required internal access token',
    optional: false,
  },
  // sunbird_keycloak_auth_server_url: {
  //   message: 'Required sunbird keycloak auth server url',
  //   optional: false,
  // },
  // sunbird_keycloak_realm: {
  //   message: 'Required sunbird keycloak realm',
  //   optional: false,
  // },
  // sunbird_keycloak_client_id: {
  //   message: 'Required sunbird keycloak client id',
  //   optional: false,
  // },
  // sunbird_keycloak_public: {
  //   message: 'Required sunbird keycloak public',
  //   optional: false,
  // },
  // sunbird_cache_store: {
  //   message: 'Required sunbird cache store',
  //   optional: false,
  // },
  // sunbird_cache_ttl: {
  //   message: 'Required sunbird cache ttl',
  //   optional: false,
  // },
  // MIGRATION_COLLECTION: {
  //   message: 'Required migrations collection name',
  //   optional: false,
  // },
  // MIGRATION_DIR: {
  //   message: 'Required migrations directory name',
  //   optional: false,
  // },
  // SLACK_COMMUNICATIONS_ON_OFF: {
  //   message: 'Enable/Disable slack communications',
  //   optional: false,
  // },
  // SLACK_EXCEPTION_LOG_URL: {
  //   message: 'Enable/Disable slack exception log url',
  //   optional: false,
  // },
  // SLACK_TOKEN: {
  //   message: 'Required slack token',
  //   optional: false,
  // },
  // RUBRIC_ERROR_MESSAGES_TO_SLACK: {
  //   message: 'Enable/Disable rubric error message',
  //   optional: false,
  // },
  CSV_REPORTS_PATH: {
    message: 'Required csv reports path',
    optional: false,
  },
  // DISABLE_TOKEN_ON_OFF: {
  //   message: '',
  //   optional: false,
  // },
  // DISABLE_TOKEN_CHECK_FOR_API: {
  //   message: 'Required Api endpoint for disabling token check',
  //   optional: false,
  // },
  // DISABLE_TOKEN_DEFAULT_USERID: {
  //   message: 'Required',
  //   optional: false,
  // },
  // DISABLE_TOKEN_DEFAULT_USER_ROLE: {
  //   message: 'ASSESSOR',
  //   optional: false,
  // },
  // DISABLE_TOKEN_DEFAULT_USER_NAME: {
  //   message: 'DISABLE_TOKEN_CHECK_DEFAULT_USER_NAME',
  //   optional: false,
  // },
  // DISABLE_TOKEN_DEFAULT_USER_EMAIL: {
  //   message: 'DISABLE_TOKEN_CHECK_DEFAULT_USER_EMAIL',
  //   optional: false,
  // },
  // DISABLE_LEARNER_SERVICE_ON_OFF: {
  //   message: 'Disable learner service',
  //   optional: false,
  // },
  KAFKA_COMMUNICATIONS_ON_OFF: {
    message: 'Enable/Disable kafka communications',
    optional: false,
  },
  KAFKA_URL: {
    message: 'Required kafka url',
    optional: false,
  },
  KAFKA_GROUP_ID: {
    message: 'Required kafka group id',
    optional: false,
  },
  COMPLETED_SUBMISSION_TOPIC: {
    message: 'Completed Submission Topics',
    optional: false,
  },
  INCOMPLETE_SUBMISSION_TOPIC: {
    message: 'Incomplete Submission Topics',
    optional: false,
  },
  SUBMISSION_RATING_QUEUE_TOPIC: {
    message: 'Submission Rating Topic',
    optional: false,
  },
  COMPLETED_OBSERVATION_SUBMISSION_TOPIC: {
    message: 'Completed Observation Topic',
    optional: false,
  },
  INCOMPLETE_OBSERVATION_SUBMISSION_TOPIC: {
    message: 'Incomplete Observation Topic',
    optional: false,
  },
  NOTIFICATIONS_TOPIC: {
    message: 'Notification Topic',
    optional: false,
  },
  CLOUD_STORAGE_PROVIDER: {
    message: 'Require cloud storage provider',
    optional: false,
  },
  CLOUD_STORAGE_SECRET: {
    message: 'Require client storage secret',
    optional: false,
  },
  CLOUD_STORAGE_BUCKETNAME: {
    message: 'Require client storage bucket name',
    optional: false,
  },
  CLOUD_STORAGE_ACCOUNTNAME: {
    message: 'Require client storage account name',
    optional: false,
  },
  CLOUD_STORAGE_BUCKET_TYPE: {
    message: 'Require client storage bucket type',
    optional: false,
  },
  // signedUrl and downloadAble url expiry durations
  DOWNLOADABLE_URL_EXPIRY_IN_SECONDS: {
    message: 'Required downloadable url expiration time',
    optional: true,
    default: 300,
  },
  PRESIGNED_URL_EXPIRY_IN_SECONDS: {
    message: 'Required presigned url expiration time',
    optional: true,
    default: 300,
  },
  USER_SERVICE_URL: {
    message: 'Required userservice service url',
    optional: false,
  },
  ENTITY_MANAGEMENT_SERVICE_URL: {
    message: 'Required entitymanagement service url',
    optional: false,
  },
  VALIDATE_ENTITIES: {
    message: 'Requires Validate Entity Key for validating Entities',
    optional: false,
    default: 'ON',
  },
  TIMEZONE_DIFFRENECE_BETWEEN_LOCAL_TIME_AND_UTC: {
    message: 'Timezone diffrence required',
    optional: true,
    default: '+05:30',
  },
  GOTENBERG_URL: {
    message: 'Gotenberg url is Required',
    optional: false,
  },
  API_DOC_URL: {
    message: 'Required api doc url',
    optional: false,
  },
  DEFAULT_ORGANISATION_CODE: {
    message: 'Required default organisation code.',
    optional: false,
  },
  // KAFKA_ERROR_MESSAGES_TO_SLACK: {
  //   message: 'ON/OFF',
  //   optional: false,
  // },
  // EMAIL_COMMUNICATIONS_ON_OFF: {
  //   message: 'ON/OFF',
  //   optional: false,
  // },
  // EMAIL_SERVICE_BASE_URL: {
  //   message: 'Required email service url',
  //   optional: false,
  // },
  // EMAIL_SERVICE_TOKEN: {
  //   message: 'Required email service token',
  //   optional: false,
  // },
  // SUBMISSION_RATING_DEFAULT_EMAIL_RECIPIENTS: {
  //   message: 'Required email recipients for submission rating',
  //   optional: false,
  // },
  // SHIKSHALOKAM_USER_PROFILE_FETCH_ENDPOINT: {
  //   message: 'Required user profile fetch API endpoint',
  //   optional: true,
  // },
  // USE_USER_ORGANISATION_ID_FILTER: {
  //   message: 'Required',
  //   optional: true,
  //   default: 'OFF',
  // },
  IS_AUTH_TOKEN_BEARER: {
    message: 'Required specification: If auth token is bearer or not',
    optional: true,
    default: false,
  },
  AUTH_METHOD: {
		message: 'Required authentication method',
		optional: true,
		default: messageConstants.common.AUTH_METHOD.NATIVE,
	},
	KEYCLOAK_PUBLIC_KEY_PATH: {
		message: 'Required Keycloak Public Key Path',
		optional: true,
		default: '../keycloakPublicKeys',
	},
  VALIDATE_ROLE: {
		message: 'Required VALIDATE_ROLE to validate role heirarchy',
		optional: true,
		default: 'ON',
	},
  TOP_LEVEL_ENTITY_TYPE: {
		message: 'Required TOP_LEVEL_ENTITY_TYPE to indentify top level entity type',
		optional: true,
    default: 'state'
	},  
	ELEVATE_SURVEY_SERVICE_URL: {
		message: 'Elevate survey service url required',
		optional: false,
	},
	SERVICE_NAME: {
		message: 'survey service name required',
		optional: false,
		default: 'survey',
	},
  ADMIN_ACCESS_TOKEN:{
    message: 'Required admin auth token',
    optional: false
  },
  ADMIN_TOKEN_HEADER_NAME:{
    message: 'Required aadmin token header name',
    optional: false
  },
  PROJECT_SERVICE_NAME: {
		message: 'project service name required',
		optional: false,
		default: 'project',
	},
  INTERFACE_SERVICE_URL: {
		message: 'interface service url required',
		optional: false,
	},
  USER_DELETE_ON_OFF: {
    message: 'Enable/Disable User data deletion',
		optional: true,
    default: 'ON'
  },
  USER_DELETE_TOPIC : {
    message: 'Required user data delete kafka topic',
		optional: true,
		requiredIf: {
			key: 'USER_DELETE_ON_OFF',
			operator: 'EQUALS',
			value: 'ON',
		},
  },
  AUTH_CONFIG_FILE_PATH: {
		message: 'Required auth config file',
		optional: true,
		default: 'config.json',
	},
  APP_PORTAL_DIRECTORY: {
		message: 'App Portal base url required',
		optional: false,
		default: '/ml/',
	},
};

let success = true;

module.exports = function () {
  Object.keys(enviromentVariables).forEach((eachEnvironmentVariable) => {
    let tableObj = {
      [eachEnvironmentVariable]: 'PASSED',
    };

    let keyCheckPass = true;

    if (
      enviromentVariables[eachEnvironmentVariable].optional === true &&
      enviromentVariables[eachEnvironmentVariable].requiredIf &&
      enviromentVariables[eachEnvironmentVariable].requiredIf.key &&
      enviromentVariables[eachEnvironmentVariable].requiredIf.key != '' &&
      enviromentVariables[eachEnvironmentVariable].requiredIf.operator &&
      validRequiredIfOperators.includes(enviromentVariables[eachEnvironmentVariable].requiredIf.operator) &&
      enviromentVariables[eachEnvironmentVariable].requiredIf.value &&
      enviromentVariables[eachEnvironmentVariable].requiredIf.value != ''
    ) {
      switch (enviromentVariables[eachEnvironmentVariable].requiredIf.operator) {
        case 'EQUALS':
          if (
            process.env[enviromentVariables[eachEnvironmentVariable].requiredIf.key] ===
            enviromentVariables[eachEnvironmentVariable].requiredIf.value
          ) {
            enviromentVariables[eachEnvironmentVariable].optional = false;
          }
          break;
        case 'NOT_EQUALS':
          if (
            process.env[enviromentVariables[eachEnvironmentVariable].requiredIf.key] !=
            enviromentVariables[eachEnvironmentVariable].requiredIf.value
          ) {
            enviromentVariables[eachEnvironmentVariable].optional = false;
          }
          break;
        default:
          break;
      }
    }

    if (enviromentVariables[eachEnvironmentVariable].optional === false) {
      if (!process.env[eachEnvironmentVariable] || process.env[eachEnvironmentVariable] == '') {
        environmentVariablesCheckSuccessful = false;
        keyCheckPass = false;
      } else if (
        enviromentVariables[eachEnvironmentVariable].possibleValues &&
        Array.isArray(enviromentVariables[eachEnvironmentVariable].possibleValues) &&
        enviromentVariables[eachEnvironmentVariable].possibleValues.length > 0
      ) {
        if (
          !enviromentVariables[eachEnvironmentVariable].possibleValues.includes(process.env[eachEnvironmentVariable])
        ) {
          environmentVariablesCheckSuccessful = false;
          keyCheckPass = false;
          enviromentVariables[eachEnvironmentVariable].message += ` Valid values - ${enviromentVariables[
            eachEnvironmentVariable
          ].possibleValues.join(', ')}`;
        }
      }
    }

    if (
      (!process.env[eachEnvironmentVariable] || process.env[eachEnvironmentVariable].trim() === '') &&
      enviromentVariables[eachEnvironmentVariable]?.optional === true &&
      enviromentVariables[eachEnvironmentVariable]?.default !== undefined
    ) {
      process.env[eachEnvironmentVariable] = enviromentVariables[eachEnvironmentVariable].default;
      keyCheckPass = true;
    }

    if (!keyCheckPass) {
      if (enviromentVariables[eachEnvironmentVariable].message !== '') {
        tableObj[eachEnvironmentVariable] = enviromentVariables[eachEnvironmentVariable].message;
      } else {
        tableObj[eachEnvironmentVariable] = `FAILED - ${eachEnvironmentVariable} is required`;
      }
    }

    tableData.push(tableObj);
  });

  log.info(tableData.toString());

  return {
    success: success,
  };
};
