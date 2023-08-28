/**
 * name : feedbackController.js
 * author : Akash
 * created-date : 22-Nov-2018
 * Description : Feedback for app.
 */

/**
    * Feedback
    * @class
*/
module.exports = class Feedback extends Abstract {

  constructor() {
    super(feedbackSchema);
  }

  static get name() {
    return "feedback";
  }

   /**
   * Feedback form.
   * @method
   * @name form
   * @param {Object} req - request Data.
   * @returns {JSON} - Feedback form information.
   */

  async form(req) {
    return new Promise(async function(resolve, reject) {

      let result = [
        {
          field: "q1",
          label: "How was your experience in the school on a scale of 1-10?",
          value: "",
          visible: true,
          editable: true,
          input: "radio",
          showRemarks:false,
          remarks:"",
          visibleIf : "",
          children : [],
          options: [
            {
              value: "1",
              label: "1"
            },
            {
              value: "2",
              label: "2"
            },
            {
              value: "3",
              label: "3"
            },
            {
              value: "4",
              label: "4"
            },
            {
              value: "5",
              label: "5"
            },
            {
              value: "6",
              label: "6"
            },
            {
              value: "7",
              label: "7"
            },
            {
              value: "8",
              label: "8"
            },
            {
              value: "9",
              label: "9"
            },
            {
              value: "10",
              label: "10"
            }
          ],
          validation: {
            required: false
          }
        },  
        {
          field: "q2",
          label: "Was the school evaluation done in a smooth and obstacle free way?",
          value: "",
          visible: true,
          editable: true,
          input: "radio",
          showRemarks:false,
          remarks:"",
          visibleIf : "",
          children : ["q3"],
          options: [
            {
              value: "yes",
              label: "Yes"
            },
            {
              value: "no",
              label: "No"
            }
          ],
          validation: {
            required: false
          }
        },  
        {
          field: "q3",
          label: "If no, what was the cause?",
          value: "",
          visible: true,
          editable: true,
          input: "multiselect",
          showRemarks:true,
          remarks:"",
          children : [],
          visibleIf : [ 
            {
                operator : "===",
                value : "no",
                field : "q2"
            }
          ], 
          options: [
            {
              value: "principalNotCooperative",
              label: "Principal did not allow to enter the school"
            },
            {
              value: "principalDidNotGiveInterview",
              label: "Principal did not give interview"
            },
            {
              value: "principalDidNotGiveSchoolRecords",
              label: "Principal did not provide school records"
            },
            {
              value: "teachersDidNotGiveInterview",
              label: "Teachers did not give interviews"
            },
            {
              value: "principalDidNotAllowStudentsToBeInterviewed",
              label: "Principal did not allow students to be interviewed"
            },
            {
              value: "principalDidNotAllowStudentsToBeAssessed",
              label: "Principal did not allow students to be assessed"
            },
            {
              value: "others",
              label: "Others"
            }
          ],
          validation: {
            required: true
          }
        },
        {
          field: "q4",
          label: "If the school has best practices, share one or two exceptional examples of them?",
          value: "",
          visible: true,
          editable: true,
          input: "textarea",
          showRemarks:false,
          remarks:"",
          visibleIf : "",
          children : [],
          validation: {
            required: false
          }
        },
        {
          field: "schoolId",
          label: "School ID",
          value: "",
          visible: false,
          editable: false,
          input: "text",
          visibleIf : "",
          validation: {
            required: true
          }
        },
        {
          field: "schoolName",
          label: "School Name",
          value: "",
          visible: false,
          editable: false,
          input: "text",
          visibleIf : "",
          validation: {
            required: true
          }
        },
        {
          field: "programId",
          label: "Program ID",
          value: "",
          visible: false,
          editable: false,
          input: "text",
          visibleIf : "",
          validation: {
            required: true
          }
        }
      ];

      let responseMessage = messageConstants.apiResponses.FEEDBACK_FORM_FETCHED;

      let response = { message: responseMessage, result: result };
      return resolve(response);

    }).catch(error => {
      reject(error);
    });
  }

};
