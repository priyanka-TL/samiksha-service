/**
 * name : health.config.js.
 * author : Mallanagouda R Biradar
 * created-date : 30-Jun-2025
 * Description : Health check config file
 */

module.exports = {
  name: process.env.SERVICE_NAME_HEALTH_CHECK,
  version: '1.0.0',
  checks: {
    mongodb: {
      enabled: true,
      url: process.env.MONGODB_URL,
    },
    kafka: {
      enabled: true,
      url: process.env.KAFKA_URL,
    },
    gotenberg: {
      enabled: true,
      url: process.env.GOTENBERG_URL,
    },
    microservices: [
      {
        name: 'EntityManagementService',
		url: `${process.env.INTERFACE_SERVICE_URL}/entity-management/health?serviceName=${process.env.SERVICE_NAME_HEALTH_CHECK}`,
        enabled: true,
        request: {
          method: 'GET',
          header: {},
          body: {},
        },

        expectedResponse: {
          status: 200,
          'params.status': 'successful',
          'result.healthy': true,
        },
      },
      {
        name: 'ProjectService',
		url: `${process.env.INTERFACE_SERVICE_URL}/project/health?serviceName=${process.env.SERVICE_NAME_HEALTH_CHECK}`,
        enabled: true,
        request: {
          method: 'GET',
          header: {},
          body: {},
        },

        expectedResponse: {
          status: 200,
          'params.status': 'successful',
          'result.healthy': true,
        },
      },
      {
        name: 'UserService',
		url: `${process.env.INTERFACE_SERVICE_URL}/user/health?serviceName=${process.env.SERVICE_NAME_HEALTH_CHECK}`,
        enabled: true,
        request: {
          method: 'GET',
          header: {},
          body: {},
        },

        expectedResponse: {
          status: 200,
          'params.status': 'successful',
          'result.healthy': true,
        },
      },
    ],
  },
};
