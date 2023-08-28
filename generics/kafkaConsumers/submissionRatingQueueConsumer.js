const submissionsHelper = require(MODULES_BASE_PATH + "/submissions/helper")
const observationSubmissionsHelper = require(MODULES_BASE_PATH + "/observationSubmissions/helper")

var messageReceived = function (message) {

  return new Promise(async function (resolve, reject) {

    try {

        let parsedMessage = JSON.parse(message.value)
    
        if(parsedMessage.submissionModel == "observationSubmissions") {
            const observationSubmissionRatingResponse = await observationSubmissionsHelper.rateSubmissionById(parsedMessage.submissionId)
        } else if (parsedMessage.submissionModel == "submissions") {
            const submissionRatingResponse = await submissionsHelper.rateSubmissionById(parsedMessage.submissionId)
        }

        return resolve("Message Processed.");

    } catch (error) {
        return reject(error);
    }

  });
};


var errorTriggered = function (error) {

  return new Promise(function (resolve, reject) {

    try {
      return resolve("Error Processed");
    } catch (error) {
      return reject(error);
    }

  });
};

module.exports = {
  messageReceived: messageReceived,
  errorTriggered: errorTriggered
};
