/**
 * name : index.js.
 * author : Aman Karki.
 * created-date : 02-Feb-2021.
 * Description : Health check Root file.
 */

let healthCheckService = require('./healthCheckService');

module.exports = function (app) {
  app.get('/healthCheckStatus', healthCheckService.healthCheckStatus);
  app.get('/health', healthCheckService.health_check);
};
