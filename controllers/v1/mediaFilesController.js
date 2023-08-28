/**
 * name : mediaFilesController.js
 * author : Deepa
 * created-date : 01-Aug-2020
 * Description : Media Files information
 */

// Dependencies
const mediaFilesHelper = require(MODULES_BASE_PATH + "/mediaFiles/helper");


/**
    * MediaFiles
    * @class
*/
module.exports = class MediaFiles extends Abstract {

    constructor() {
        super(mediaFilesSchema);
    }

    static get name() {
        return "mediaFiles";
    }

     /**
     * @api {post} /assessment/api/v1/mediaFiles/createEmoji Create Emoji
     * @apiVersion 1.0.0
     * @apiName Create Emoji
     * @apiGroup MediaFiles
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/mediaFiles/createEmoji
     * @apiParamExample {json} Request-Body:
     * {
     *  "name": "smiley",
     *  "unicode": "\u{1F600}"
     * }
     * @apiParamExample {json} Response:
     * {
     *  "status": 200,
     *  "message": "Emoji created successfully"
     *}
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Create Emoji.
    * @method
    * @name createEmoji
    * @param {Object} req -request Data.
    * @param {String} req.body.name - emoji name
    * @param {String} req.body.unicode - unicode of emoji
    * @returns {String} - message .
    */

   createEmoji(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let result = await mediaFilesHelper.createEmoji
            (
              req.body.name,
              req.body.unicode,
              req.userDetails.userId
            );

            return resolve({
                message: result.message
            });

        } catch (error) {

            return reject({
                status: error.status || httpStatusCode.internal_server_error.status,
                message: error.message || httpStatusCode.internal_server_error.message,
                errorObject: error
            });
        }
    })
}


     /**
     * @api {post} /assessment/api/v1/mediaFiles/createGesture Create Gesture
     * @apiVersion 1.0.0
     * @apiName Create Gesture
     * @apiGroup MediaFiles
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/mediaFiles/createGesture
     * @apiParamExample {json} Request-Body:
     * {
     *  "name": "thumbsUp",
     *  "unicode": "\u{1F600}"
     * }
     * @apiParamExample {json} Response:
     * {
     *  "status": 200,
     *  "message": "Gesture created successfully"
     *}
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Create Gesture.
    * @method
    * @name createGesture
    * @param {Object} req -request Data.
    * @param {String} req.body.name - gesture name
    * @param {String} req.body.unicode - unicode of gesture
    * @returns {String} - message .
    */

   createGesture(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let result = await mediaFilesHelper.createGesture
            (
                req.body.name,
                req.body.unicode,
                req.userDetails.userId
            );

            return resolve({
                message: result.message
            });

        } catch (error) {

            return reject({
                status: error.status || httpStatusCode.internal_server_error.status,
                message: error.message || httpStatusCode.internal_server_error.message,
                errorObject: error
            });
        }
    })
}


    /**
     * @api {post} /assessment/api/v1/mediaFiles/getGesture Get Gesture
     * @apiVersion 1.0.0
     * @apiName Get Gesture
     * @apiGroup MediaFiles
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/mediaFiles/getGesture
     * @apiParamExample {json} Request-Body:
     * {
     *  "name": ["writing hand"]
     * }
     * @apiParamExample {json} Response:
     * {
     *  "status": 200,
     *  "message": "Gesture fetched successfully",
     *  "result" : [{
     *      "name": "writing hand",
            "type": "gesture",
            "unicode": "✍",
            "status": "active"
         }]
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Get Gesture.
    * @method
    * @name getGesture
    * @param {Object} req -request Data.
    * @param {String} req.body.name - gesture name
    * @returns {JSON} - gesture unicode.
    */

    getGesture(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let gestureDocument = await mediaFilesHelper.getGesture
            (
                req.body.name
            );

            return resolve({
                message: gestureDocument.message,
                result: gestureDocument.data
            });

        } catch (error) {

            return reject({
                status: error.status || httpStatusCode.internal_server_error.status,
                message: error.message || httpStatusCode.internal_server_error.message,
                errorObject: error
            });
        }
    })
}


    /**
     * @api {post} /assessment/api/v1/mediaFiles/getEmoji Get Emoji
     * @apiVersion 1.0.0
     * @apiName Get Emoji
     * @apiGroup MediaFiles
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/mediaFiles/getEmoji
     * @apiParamExample {json} Request-Body:
     * {
     *  "name": ["astonished face"]
     * }
     * @apiParamExample {json} Response:
      * {
     *  "status": 200,
     *  "message": "Emoji fetched successfully",
     *  "result" : [{
     *     "name": "astonished face",
     *     "type": "emoji",
     *     "unicode": "😲",
     *     "status": "active"
     *   }] 
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Get Emoji.
    * @method
    * @name getEmoji
    * @param {Object} req -request Data.
    * @param {String} req.body.name - emoji name
    * @returns {JSON} - emoji unicode.
    */

   getEmoji(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let emojiDocument = await mediaFilesHelper.getEmoji
            (
                req.body.name
            );

            return resolve({
                message: emojiDocument.message,
                result: emojiDocument.data
            });

        } catch (error) {

            return reject({
                status: error.status || httpStatusCode.internal_server_error.status,
                message: error.message || httpStatusCode.internal_server_error.message,
                errorObject: error
            });
        }
    })
}

   
   /**
     * @api {get} /assessment/api/v1/mediaFiles/getAllGestures Get All Gestures
     * @apiVersion 1.0.0
     * @apiName Get All Gestures
     * @apiGroup MediaFiles
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/mediaFiles/getAllGestures
     * @apiParamExample {json} Response:
     * {
     *  "status": 200,
     *  "message": "Gesture fetched successfully",
     *  "result" : [{
     *      "name": "writing hand",
            "type": "gesture",
            "unicode": "✍",
            "status": "active"
         }]
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Get All Gestures.
    * @method
    * @name getAllGestures
    * @param {Object} req -request Data.
    * @returns {JSON} - gesture unicode.
    */

   getAllGestures(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let gestureDocuments = await mediaFilesHelper.getGesture();

            return resolve({
                message: gestureDocuments.message,
                result: gestureDocuments.data
            });

        } catch (error) {

            return reject({
                status: error.status || httpStatusCode.internal_server_error.status,
                message: error.message || httpStatusCode.internal_server_error.message,
                errorObject: error
            });
        }
    })
}

       /**
     * @api {get} /assessment/api/v1/mediaFiles/getAllEmojis Get All Emojis
     * @apiVersion 1.0.0
     * @apiName Get All Emojis
     * @apiGroup MediaFiles
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/mediaFiles/getAllEmojis
     * @apiParamExample {json} Response:
     * {
     *  "status": 200,
     *  "message": "Emoji fetched successfully",
      *  "result" : [{
     *     "name": "astonished face",
     *     "type": "emoji",
     *     "unicode": "😲",
     *     "status": "active"
     *   }] 
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Get All Emojis.
    * @method
    * @name getAllEmojis
    * @param {Object} req -request Data.
    * @returns {JSON} - emoji unicode.
    */

   getAllEmojis(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let emojiDocuments = await mediaFilesHelper.getGesture();

            return resolve({
                message: emojiDocuments.message,
                result: emojiDocuments.data
            });

        } catch (error) {

            return reject({
                status: error.status || httpStatusCode.internal_server_error.status,
                message: error.message || httpStatusCode.internal_server_error.message,
                errorObject: error
            });
        }
    })
}


}
