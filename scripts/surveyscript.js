const request = require('request');
let scriptData = require('./Data.json');
const fs = require('fs');

//This function will be used to create user accounts saved in Data.json
function createAccount(userData) {
  return new Promise((resolve, reject) => {
    try {
      const accountCreateCallback = async function (err, response) {
        if (err) {
          return reject({
            status: 400,
            message: 'User  Down',
          });
        } else {
          let userDetails = JSON.parse(response.body);
          //it create account if user already exists then it will perform login action
          if (userDetails.responseCode == 'OK') {
            return resolve(userDetails.result);
          } else {
            let accountLogin = await loginAccount(userData);
            return resolve(accountLogin.result);
          }
        }
      };

      request.post(
        'http://localhost:3001/user/v1/account/create',
        {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...userData,
            isAMentor: true,
            secretCode: '4567',
          }),
        },
        accountCreateCallback,
      );
    } catch (error) {
      return reject(error);
    }
  });
}
//This function will be used to do login
function loginAccount(userData) {
  return new Promise((resolve, reject) => {
    try {
      const accountLoginCallback = function (err, response) {
        if (err) {
          return reject({
            status: 400,
            message: 'User  Down',
          });
        } else {
          let userDetails = JSON.parse(response.body);
          return resolve(userDetails);
        }
      };

      request.post(
        'http://localhost:3001/user/v1/account/login',
        {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password,
          }),
        },
        accountLoginCallback,
      );
    } catch (error) {
      return reject(error);
    }
  });
}

// function pollCreate(userAuthToken, pollData) {
//   return new Promise((resolve, reject) => {
//     try {
//       const pollCreateCallback = function (err, response) {
//         if (err) {
//           return reject({
//             status: 400,
//             message: 'samiksha  Down',
//           });
//         } else {
//           let pollCreateData = JSON.parse(response.body);
//           return resolve(pollCreateData);
//         }
//       };

//       request.post(
//         'http://localhost:4301/assessment/api/v1/polls/create',
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'x-authenticated-user-token': userAuthToken,
//             appname: 'mentored',
//           },
//           body: JSON.stringify(pollData),
//         },
//         pollCreateCallback,
//       );
//     } catch (error) {
//       return reject(error);
//     }
//   });
// }
// function pollList(userAuthToken) {
//   return new Promise((resolve, reject) => {
//     try {
//       const pollListCallback = function (err, response) {
//         if (err) {
//           return reject({
//             status: 400,
//             message: 'samiksha  Down',
//           });
//         } else {
//           let pollCreateData = JSON.parse(response.body);
//           return resolve(pollCreateData);
//         }
//       };

//       request.get(
//         'http://localhost:4301/assessment/api/v1/polls/list',
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'x-authenticated-user-token': userAuthToken,
//             appname: 'mentored',
//           },
//         },
//         pollListCallback,
//       );
//     } catch (error) {
//       return reject(error);
//     }
//   });
// }
// function pollGetQuestions(userAuthToken, pollId) {
//   return new Promise((resolve, reject) => {
//     try {
//       const pollQuestionCallback = function (err, response) {
//         if (err) {
//           return reject({
//             status: 400,
//             message: 'samiksha  Down',
//           });
//         } else {
//           let pollData = JSON.parse(response.body);
//           return resolve(pollData);
//         }
//       };

//       request.get(
//         `http://localhost:4301/assessment/api/v1/polls/getPollQuestions/${pollId}`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'x-authenticated-user-token': userAuthToken,
//             appname: 'mentored',
//           },
//         },
//         pollQuestionCallback,
//       );
//     } catch (error) {
//       return reject(error);
//     }
//   });
// }

// function pollSubmit(userAuthToken, pollId, questions) {
//   return new Promise((resolve, reject) => {
//     try {
//       const pollSubmitCallback = function (err, response) {
//         if (err) {
//           return reject({
//             status: 400,
//             message: 'samiksha  Down',
//           });
//         } else {
//           let pollData = JSON.parse(response.body);
//           return resolve(pollData);
//         }
//       };
//       let answers = ['R1', 'R2', 'R3'];

//       request.get(
//         `http://localhost:4301/assessment/api/v1/pollSubmissions/make/${pollId}`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'x-authenticated-user-token': userAuthToken,
//             appname: 'mentored',
//           },
//           body: JSON.stringify({
//             [questions.qid]: {
//               qid: questions.qid,
//               question: questions.question,
//               responseType: questions.responseType,
//               value: answers[Math.floor(Math.random() * answers.length)],
//             },
//           }),
//         },
//         pollSubmitCallback,
//       );
//     } catch (error) {
//       return reject(error);
//     }
//   });
// }

// function pollReport(userAuthToken, pollId) {
//   return new Promise((resolve, reject) => {
//     try {
//       const pollReportCallback = function (err, response) {
//         if (err) {
//           return reject({
//             status: 400,
//             message: 'samiksha  Down',
//           });
//         } else {
//           let pollData = JSON.parse(response.body);
//           return resolve(pollData);
//         }
//       };

//       request.get(
//         `http://localhost:4301/assessment/api/v1/polls/report/${pollId}`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'x-authenticated-user-token': userAuthToken,
//             appname: 'mentored',
//           },
//         },
//         pollReportCallback,
//       );
//     } catch (error) {
//       return reject(error);
//     }
//   });
// }
// async function polls() {
//   try {
//     let Reports = [];
//     let accountCreate = [];
//     for (let users = 0; users < scriptData.users.length; users++) {
//       accountCreate.push(createAccount(scriptData.users[users]));
//     }
//     let accountcreatedData = await Promise.all(accountCreate);
//     let pollDataCreate = [];
//     for (let poll = 0; poll < scriptData.polls.length; poll++) {
//       pollDataCreate.push(pollCreate(accountcreatedData[0].access_token, scriptData.polls[poll]));
//     }
//     await Promise.all(pollDataCreate);
//     let pollReports = [];
//     let listPolls = await pollList(accountcreatedData[0].access_token);
//     for (let poll = 0; poll < listPolls.result.length; poll++) {
//       for (let user = 0; user < accountcreatedData.length; user++) {
//         let getPollQuestions = await pollGetQuestions(
//           accountcreatedData[user].access_token,
//           listPolls.result[poll]._id,
//         );
//         console.log(JSON.stringify(getPollQuestions.result.questions[0]));
//         let submitPoll = await pollSubmit(
//           accountcreatedData[user].access_token,
//           listPolls.result[poll]._id,
//           getPollQuestions.result.questions[0],
//         );
//       }
//       let pollReportData = await pollReport(accountcreatedData[0].access_token, listPolls.result[poll]._id);
//       pollReports.push(pollReportData);
//     }
//     fs.writeFile(
//       'pollsreports.json',

//       JSON.stringify(pollReports),

//       function (err) {
//         if (err) {
//           console.error('Crap happens');
//         }
//       },
//     );
//   } catch (err) {
//     console.error(err);
//   }
// }
// polls();

//this function will be used to create survey solution template
function createSurveyTemplateSolution(surveySolutionData, userAuthToken) {
  return new Promise((resolve, reject) => {
    try {
      const surveyTemplateCallback = async function (err, response) {
        if (err) {
          return reject({
            status: 400,
            message: 'User  Down',
          });
        } else {
          let surveyTemplate = JSON.parse(response.body);
          return resolve(surveyTemplate);
        }
      };

      request.post(
        'http://localhost:4301/assessment/api/v1/surveys/createSolutionTemplate',
        {
          headers: {
            'Content-Type': 'application/json',
            'x-authenticated-user-token': userAuthToken,
          },
          body: JSON.stringify(surveySolutionData),
        },
        surveyTemplateCallback,
      );
    } catch (error) {
      return reject(error);
    }
  });
}
//this function will be used to upload question saved in SurveyQuestions.csv file
function questionUpload(userAuthToken) {
  return new Promise((resolve, reject) => {
    try {
      const surveyQuestionUploadCallback = async function (err, response) {
        if (err) {
          return reject({
            status: 400,
            message: 'User  Down',
          });
        } else {
          let surveyTemplate = response.body;
          return resolve(surveyTemplate);
        }
      };

      request.post(
        'http://localhost:4301/assessment/api/v1/questions/bulkCreate',
        {
          headers: {
            'Content-Type': 'application/json',
            'x-authenticated-user-token': userAuthToken,
          },
          formData: {
            questions: {
              value: fs.createReadStream('./SurveyQuestions.csv'),
              options: {
                filename: 'SurveyQuestions.csv',
                contentType: null,
              },
            },
          },
        },
        surveyQuestionUploadCallback,
      );
    } catch (error) {
      return reject(error);
    }
  });
}
// this function iswill be used to create a new survey solution from survey solution template
function createChildSolution(solutionId, userAuthToken) {
  return new Promise((resolve, reject) => {
    try {
      const createChildSurveySolutionCallback = async function (err, response) {
        if (err) {
          return reject({
            status: 400,
            message: 'User  Down',
          });
        } else {
          let surveySolution = response.body;
          return resolve(surveySolution);
        }
      };

      console.log(solutionId);
      request.get(
        `http://localhost:4301/assessment/api/v1/surveys/importSurveyTemplateToSolution/${solutionId}?appName=mentored`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-authenticated-user-token': userAuthToken,
          },
        },
        createChildSurveySolutionCallback,
      );
    } catch (error) {
      return reject(error);
    }
  });
}
//this function is used to get survey details from survey solution
function solutionDetails(solutionId, userAuthToken) {
  return new Promise((resolve, reject) => {
    try {
      const solutionDetailsCallback = async function (err, response) {
        if (err) {
          return reject({
            status: 400,
            message: 'User  Down',
          });
        } else {
          let surveySolution = response.body;
          return resolve(surveySolution);
        }
      };

      request.get(
        `http://localhost:4301/assessment/api/v3/surveys/details?solutionId=${solutionId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-authenticated-user-token': userAuthToken,
          },
        },
        solutionDetailsCallback,
      );
    } catch (error) {
      return reject(error);
    }
  });
}
// this function will be responsible for creating the solution step by step and get survey details
async function survey() {
  try {
    let accountLogin = await createAccount(scriptData.users[0]);

    let surveyTemplate = await createSurveyTemplateSolution(scriptData.survey, accountLogin.access_token);
    console.log(surveyTemplate);
    let questionUploads = await questionUpload(accountLogin.access_token);
    console.log(questionUploads);

    let childSurveySolutions = await createChildSolution(surveyTemplate.result.solutionId, accountLogin.access_token);
    console.log(childSurveySolutions);
    let solutionDetailsForUser = await solutionDetails(surveyTemplate.result.solutionId, accountLogin.access_token);
    console.log(solutionDetailsForUser);

    fs.writeFile(
      'surveySolution.json',

      solutionDetailsForUser,

      function (err) {
        if (err) {
          console.error('Crap happens');
        }
      },
    );
  } catch (err) {
    console.log(err);
  }
}

survey();
