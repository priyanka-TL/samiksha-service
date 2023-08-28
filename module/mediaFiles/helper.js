/**
 * name : mediaFiles/helper.js
 * author : Deepa
 * created-date : 01-Aug-2020
 * Description : Media Files helper functionality.
 */

// Dependencies

/**
    * MediaFilesHelper
    * @class
*/
module.exports = class MediaFilesHelper {

    /**
   * find mediaFiles
   * @method
   * @name mediaFileDocuments
   * @param {Array} [mediaFileFilter = "all"] - media file ids.
   * @param {Array} [fieldsArray = "all"] - projected fields.
   * @param {Array} [skipFields = "none"] - field not to include
   * @returns {Array} List of mediaFiles. 
   */
  
  static mediaFileDocuments(
    mediaFileFilter = "all", 
    fieldsArray = "all",
    skipFields = "none"
  ) {
    return new Promise(async (resolve, reject) => {
        try {
    
            let queryObject = (mediaFileFilter != "all") ? mediaFileFilter : {};
    
            let projection = {}
    
            if (fieldsArray != "all") {
                fieldsArray.forEach(field => {
                    projection[field] = 1;
                });
            }

            if( skipFields !== "none" ) {
              skipFields.forEach(field=>{
                projection[field] = 0;
              })
            }
    
            let mediaFileDocuments = 
            await database.models.mediaFiles.find(
              queryObject, 
              projection
            ).lean();
            
            return resolve(mediaFileDocuments);
            
        } catch (error) {
            return reject(error);
        }
    });
 }

    /**
     * Create emoji.
     * @method 
     * @name createEmoji
     * @param {String} name - emoji name
     * @param {string} unicode -  unicode of emoji
     * @param {String} userId - userId 
     * @returns {String} - message.
     */

    static createEmoji(name= "",unicode= "",userId= "") {
        return new Promise(async (resolve, reject) => {
            try {

                if (name == "") {
                    throw new Error(messageConstants.apiResponses.NAME_REQUIRED_CHECK)
                }

                if (unicode == "") {
                    throw new Error(messageConstants.apiResponses.UNICODE_REQUIRED_CHECK)
                }

                if (userId == "") {
                    throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK)
                }

                await database.models.mediaFiles.create
                ({
                    name: name,
                    type: "emoji",
                    unicode: unicode,
                    status: "active",
                    createdBy: userId,
                    updatedBy: userId,
                    isDeleted: false
                })
               
                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.EMOJI_CREATED,
                    data: true
                });

            } catch (error) {
                return resolve({
                    success: false,
                    message: error.message,
                    data: false
                });
            }
        });
    }


    /**
     * Create gesture.
     * @method
     * @name createGesture
     * @param {String} name - gesture name
     * @param {string} unicode -  unicode of gesture
     * @param {String} userId - userId 
     * @returns {String} - message.
     */

    static createGesture(name= "",unicode= "",userId= "") {
        return new Promise(async (resolve, reject) => {
            try {

                if (name == "") {
                    throw new Error(messageConstants.apiResponses.NAME_REQUIRED_CHECK)
                }

                if (unicode == "") {
                    throw new Error(messageConstants.apiResponses.UNICODE_REQUIRED_CHECK)
                }

                if (userId == "") {
                    throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK)
                }

                await database.models.mediaFiles.create
                ({
                    name: name,
                    type: "gesture",
                    unicode: unicode,
                    status: "active",
                    createdBy: userId,
                    updatedBy: userId,
                    isDeleted: false
                })
               
                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.GESTURE_CREATED,
                    data: true
                });

            } catch (error) {
                 return resolve({
                    success: false,
                    message: error.message,
                    data: false
                });
            }
        });
    }


    /**
     * Get emoji.
     * @method
     * @name getEmoji
     * @param {String} name - emoji name 
     * @returns {JSON} - emoji unicode.
     */

    static getEmoji(name= "") {
        return new Promise(async (resolve, reject) => {
            try {
                
                let queryObject = {
                    status: "active",
                    type: messageConstants.common.EMOJI
                };

                if (name) {
                    if (Array.isArray(name)) {
                        queryObject.name = {
                            $in : name
                        }
                    }
                    else {
                       queryObject.name = name
                    }
                }

                let emojiDocument = await this.mediaFileDocuments
                (
                   queryObject,
                    [
                        "name",
                        "unicode",
                        "type",
                        "status"
                    ]
                )

                if (!emojiDocument.length) {
                    throw new Error(messageConstants.apiResponses.EMOJI_NOT_FOUND)
                }
               
                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.EMOJI_FETCHED,
                    data: emojiDocument
                });

            } catch (error) {
                 return resolve({
                    success: false,
                    message: error.message,
                    data: false
                });
            }
        });
    }

     /**
     * Get gesture.
     * @method
     * @name getGesture
     * @param {String} name - gesture name
     * @returns {JSON} - gesture unicode.
     */

    static getGesture(name= "") {
        return new Promise(async (resolve, reject) => {
            try {

                let queryObject = {
                    status: "active",
                    type: messageConstants.common.GESTURE
                };

                if (name) {
                    if (Array.isArray(name)) {
                        queryObject.name = {
                            $in : name
                        }
                    }
                    else {
                       queryObject.name = name
                    }
                }


                let gestureDocument = await this.mediaFileDocuments
                (
                    queryObject,
                    [
                        "name",
                        "unicode",
                        "type",
                        "status"
                    ]
                )

                if (!gestureDocument.length) {
                    throw new Error(messageConstants.apiResponses.GESTURE_NOT_FOUND)
                }
               
                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.GESTURE_FETCHED,
                    data: gestureDocument
                });

            } catch (error) {
               return resolve({
                    success: false,
                    message: error.message,
                    data: false
                });
            }
        });
    }
}
