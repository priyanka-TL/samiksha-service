/**
 * name : StaticLinks/helper.js
 * author : Akash
 * created-date : 22-feb-2019
 * Description : Static links related helper functionality.
 */

/**
    * StaticLinksHelper
    * @class
*/
module.exports = class StaticLinksHelper {

    /**
   * List static links.
   * @method
   * @name staticLinksDocuments
   * @param {Object} [ staticLinksFilter = "all" ] - static link filter query.
   * @param {Array} [ fieldsArray = "all" ] - Projection fields.
   * @param {Array} [ skipFields = "none" ] - Fields to skip.
   * @returns {Array} List of static links data. 
   */

    static staticLinksDocuments(
        staticLinksFilter = "all", 
        fieldsArray = "all",
        skipFields = "none"
    ) {
        return new Promise(async (resolve, reject) => {
            try {

                let queryObject = (staticLinksFilter != "all") ? staticLinksFilter : {};
    
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

                let staticLinkData = 
                await database.models.staticLinks.find(queryObject,projection).lean();

                return resolve(staticLinkData);

            } catch (error) {
                return reject(error);
            }
        })


    }

     /**
   * Bulk create static links.
   * @method
   * @name bulkCreate
   * @param {Object} staticLinksCSVData - array of static links
   * @param {Object} userDetails - logged in user data.
   * @param {String} userDetails.id - logged in user id. 
   * @returns {Array} List of static links with _SYSTEM_ID. 
   */

    static bulkCreate(staticLinksCSVData,userDetails) {

        return new Promise(async (resolve, reject) => {
            try {

                const staticLinksUploadedData = await Promise.all(
                    staticLinksCSVData.map(async staticLink => {

                        try {

                            let newLink = await database.models.staticLinks.create(
                                _.merge({
                                    "status" : "active",
                                    "updatedBy": userDetails.id,
                                    "createdBy": userDetails.id
                                },gen.utils.valueParser(staticLink))
                            );

                            if (newLink._id) {
                                staticLink["_SYSTEM_ID"] = newLink._id ;
                                staticLink.status = "Success";
                            } else {
                                staticLink["_SYSTEM_ID"] = "";
                                staticLink.status = "Failed";
                            }

                        } catch (error) {
                            staticLink["_SYSTEM_ID"] = "";
                            staticLink.status = error.message;
                        }


                        return staticLink;
                    })
                )


                return resolve(staticLinksUploadedData);

            } catch (error) {
                return reject(error)
            }
        })

    }

      /**
   * Bulk update static links.
   * @method
   * @name bulkUpdate
   * @param {Object} staticLinksCSVData - array of static links
   * @param {Object} userDetails - logged in user data.
   * @param {String} userDetails.id - logged in user id. 
   * @returns {Array} List of static links with _SYSTEM_ID. 
   */

    static bulkUpdate(staticLinksCSVData,userDetails) {

        return new Promise(async (resolve, reject) => {
            try {

                const staticLinksUploadedData = await Promise.all(
                    staticLinksCSVData.map(async staticLink => {

                        try {
                            
                            let updatedData = 
                            _.merge({
                                "updatedBy": userDetails.id
                            },gen.utils.valueParser(staticLink));

                            let unSetData = {};

                            if( staticLink.appName  && staticLink.appName !== "" ) {
                                updatedData["isCommon"] = false;
                            } else {
                                updatedData["isCommon"] = true;
                                unSetData["appName"] = 1;
                            }

                            let updateLink = await database.models.staticLinks.findOneAndUpdate(
                                {
                                    _id : staticLink._SYSTEM_ID
                                },
                                {
                                    "$unset" : unSetData,
                                    "$set" : _.omit(updatedData,["_SYSTEM_ID"])
                                }
                            );

                            if (updateLink._id) {
                                staticLink["_SYSTEM_ID"] = updateLink._id ;
                                staticLink.status = "Success";
                            } else {
                                staticLink["_SYSTEM_ID"] = "";
                                staticLink.status = "Failed";
                            }

                        } catch (error) {
                            staticLink["_SYSTEM_ID"] = "";
                            staticLink.status = error.message;
                        }


                        return staticLink;
                    })
                )


                return resolve(staticLinksUploadedData);

            } catch (error) {
                return reject(error);
            }
        })

    }

    /**
   * List static links.
   * @method
   * @name list
   * @param {String} [appType = "" ] - app type.
   * @param {String} [appname = "" ] - name of app.
   * @param {String} [version = "v1" ] - Controller version.
   * @returns {Array} List of static links data. 
   */

  static list(appType = "" ,appname = "" , version = messageConstants.common.VERSION_1 ) {
    return new Promise(async (resolve, reject) => {
        try {

            let appSpecificQuery = {
                status: messageConstants.common.ACTIVE_STATUS,
                isDeleted: false
            };

            if( appType && appType !== "" ) {
                appSpecificQuery["appType"] = appType;
            }

            if( version === messageConstants.common.VERSION_1 ) {
                appSpecificQuery["link"] =  {
                    $ne : ""
                }
            }

            let commonSpecificQuery = {...appSpecificQuery};

            if( appname && appname !== "" ) {
                appSpecificQuery["appName"] = appname;
            }

            let projection = ["value","link","title","metaInformation"];
            let appSpecificStaticLinks = [];

            if( appSpecificQuery.appType && appSpecificQuery.appName ) {
                
                appSpecificStaticLinks = 
                await this.staticLinksDocuments(appSpecificQuery,projection);
            }

            if( appSpecificStaticLinks.length > 0 ) {

                let appSpecificValue = [];
                
                appSpecificStaticLinks.forEach(staticLink => {
                    appSpecificValue.push(staticLink.value);
                });

                commonSpecificQuery["value"] = { $nin : appSpecificValue };
            }

            commonSpecificQuery.isCommon = true;

            let commonStaticLinks = 
            await this.staticLinksDocuments(commonSpecificQuery,projection);

            let result = {};

            if( version === messageConstants.common.VERSION_2 ) {
                appSpecificStaticLinks = _.keyBy(appSpecificStaticLinks, 'value');
                commonStaticLinks = _.keyBy(commonStaticLinks,"value");
                result = {...appSpecificStaticLinks,...commonStaticLinks};
            } else {
                result = [...appSpecificStaticLinks,...commonStaticLinks];
            }

            return resolve({
                message: messageConstants.apiResponses.STATIC_LINKS_FETCHED,
                result: result
            });

        } catch (error) {
            return reject(error);
        }
    })


}

};