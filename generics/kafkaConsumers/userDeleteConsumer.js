/**
 * name : userDeleteConsumer.js
 * author : Priyanka Pradeep
 * created-date : 27-May-2025
 * Description : User delete consumer.
 */
const usersHelper = require(MODULES_BASE_PATH + '/users/helper');

/**
 * user delete consumer message received.
 * @function
 * @name messageReceived
 * @param {Object} message - consumer data
 * {
 *   highWaterOffset:63
 *   key:null
 *   offset:62
 *   partition:0
 *   topic:'deleteuser'
 *   value:'{"entity":"user","eventType":"delete","entityId":101,"changes":{},"created_by":4,"organization_id":22,"tenant_code":"shikshagraha","status":"INACTIVE","deleted":true,"id":101,"username":"user_shqwq1ssddw"}'
 * }
 * @returns {Promise} return a Promise.
 */
var messageReceived = function (message) {
  return new Promise(async function (resolve, reject) {
    try {
      let parsedMessage = JSON.parse(message.value);
      if (
        parsedMessage.entity === messageConstants.common.DELETE_EVENT_ENTITY &&
        parsedMessage.eventType === messageConstants.common.DELETE_EVENT_TYPE
      ) {
        let userDataUpdateSatus = await usersHelper.deleteUserPIIData(parsedMessage);
        if (userDataUpdateSatus.status === 200) {
          return resolve('Message Processed.');
        } else {
          return resolve('Message Processed.');
        }
      }
    } catch (error) {
      return reject(error);
    }
  });
};

var errorTriggered = function (error) {
  return new Promise(function (resolve, reject) {
    try {
      return resolve('Error Processed');
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = {
  messageReceived: messageReceived,
  errorTriggered: errorTriggered,
};
