/**
 * name : filesController.js
 * author : Akash
 * created-date : 22-Nov-2018
 * Description : All files related information.
 */

// Dependencies
const filesHelper = require(MODULES_BASE_PATH + '/cloud-services/files/helper')
/**
 * FileUpload
 * @class
 */
module.exports = class FileUpload {
    /**
     * @api {post} /assessment/api/v1/files/preSignedUrls  
     * Get signed URL.
     * @apiVersion 1.0.0
     * @apiGroup Files
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiParamExample {json} Request:
     * {
     *  "request" : {
     *  "5f72f9998925ec7c60f79a91": {
     *     "files": ["uploadFile.jpg", "uploadFile2.jpg"]
        }},
        "ref" : "survey"
      }
     * @apiSampleRequest /assessment/api/v1/files/preSignedUrls  
     * @apiUse successBody
     * @apiUse errorBody
     * @apiParamExample {json} Response:
     * * {
    "message": "URLs generated successfully.",
    "status": 200,
    "result": {
        "5f72f9998925ec7c60f79a91": {
            "files": [
                {
                    "file": "survey/5f72f9998925ec7c60f79a91/6/df9e49bb-f7b2-451a-a4eb-0938ec76aecf/uploadFile.jpg",
                    "payload": {
                        "sourcePath": "survey/5f72f9998925ec7c60f79a91/6/df9e49bb-f7b2-451a-a4eb-0938ec76aecf/uploadFile.jpg"
                    },
                    "cloudStorage": "AWS",
                    "downloadableUrl": "https://mentoring-prod-storage-private.s3.ap-south-1.amazonaws.com/survey/5f72f9998925ec7c60f79a91/6/df9e49bb-f7b2-451a-a4eb-0938ec76aecf/uploadFile.jpg",
                    "url": "https://mentoring-prod-storage-private.s3.ap-south-1.amazonaws.com/survey/5f72f9998925ec7c60f79a91/6/df9e49bb-f7b2-451a-a4eb-0938ec76aecf/uploadFile.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIASKKP73WS75M2EBXZ%2F20240606%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240606T103807Z&X-Amz-Expires=1800&X-Amz-Signature=3ef7f8d5bffcddd2dca722e58b59ce70fab88853508d51542f40235a9391d1d7&X-Amz-SignedHeaders=host&x-id=GetObject"
                },
                {
                    "file": "survey/5f72f9998925ec7c60f79a91/6/df9e49bb-f7b2-451a-a4eb-0938ec76aecf/uploadFile2.jpg",
                    "payload": {
                        "sourcePath": "survey/5f72f9998925ec7c60f79a91/6/df9e49bb-f7b2-451a-a4eb-0938ec76aecf/uploadFile2.jpg"
                    },
                    "cloudStorage": "AWS",
                    "downloadableUrl": "https://mentoring-prod-storage-private.s3.ap-south-1.amazonaws.com/survey/5f72f9998925ec7c60f79a91/6/df9e49bb-f7b2-451a-a4eb-0938ec76aecf/uploadFile2.jpg",
                    "url": "https://mentoring-prod-storage-private.s3.ap-south-1.amazonaws.com/survey/5f72f9998925ec7c60f79a91/6/df9e49bb-f7b2-451a-a4eb-0938ec76aecf/uploadFile2.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIASKKP73WS75M2EBXZ%2F20240606%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240606T103807Z&X-Amz-Expires=1800&X-Amz-Signature=d10f04e2564e28a3e1089010de5d551ee144afce292a0f77f6dd3788762f82d9&X-Amz-SignedHeaders=host&x-id=GetObject"
                }
            ]
        }
    }
}
     */

  /**
   * Get signed urls.
   * @method
   * @name preSignedUrls
   * @param  {Request}  req  request body.
   * @param  {Array}  req.body.fileNames - list of file names
   * @param  {String}  req.body.bucket - name of the bucket
   * @returns {JSON} Response with status and message.
   */
  async preSignedUrls(req) {

      try {
        let signedUrl = await filesHelper.preSignedUrls(
          req.body.request,
          req.body.ref,
          req.userDetails ? req.userDetails.userId : '',
          req.query.serviceUpload == 'true' ? true : false,
        );
        signedUrl['result'] = signedUrl['data'];
        return signedUrl;
      } catch (error) {
        return {
          status: error.status || httpStatusCode['internal_server_error'].status,

          message: error.message || httpStatusCode['internal_server_error'].message,

          errorObject: error,
        }
      }

  }

      /**
     * @api {get} /assessment/api/v1/files/getDownloadableUrl  
     * Get downloadable URL.
     * @apiVersion 1.0.0
     * @apiGroup Files
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiParamExample {json} Request:
     *  {
     *  "filePaths": [
     *   "survey/5f72f9998925ec7c60f79a91/6/a8c119e6-ec1e-4bb9-adf7-f87151558def/uploadFile2.jpg"
     *  ]
     * }
     * @apiSampleRequest /assessment/api/v1/files/getDownloadableUrl
     * @apiUse successBody
     * @apiUse errorBody
     * @apiParamExample {json} Response:
     *   {
     *       "message": "URLs generated successfully.",
     *       "status": 200,
     *       "result": [
     *          {
     *              "cloudStorage": "aws",
     *              "filePath": "survey/5f72f9998925ec7c60f79a91/6/a8c119e6-ec1e-4bb9-adf7-f87151558def/uploadFile2.jpg",
     *              "url": "https://mentoring-prod-storage-private.s3.ap-south-1.amazonaws.com/survey/5f72f9998925ec7c60f79a91/6/a8c119e6-ec1e-4bb9-adf7-f87151558def/uploadFile2.jpg"
     *          }
     *       ]
     *   }
     */

  /**
   * Get Downloadable URL from cloud service.
   * @method
   * @name getDownloadableUrl
   * @param  {Request}  req  request body.
   * @returns {JSON} Response with status and message.
   */

  async getDownloadableUrl(req) {
      try {
        let downloadableUrl = await filesHelper.getDownloadableUrl(
          req.body.filePaths
        );
        return downloadableUrl;
      } catch (error) {
        return {
          status:
            error.status || httpStatusCode["internal_server_error"].status,

          message:
            error.message || httpStatusCode["internal_server_error"].message,

          errorObject: error,
        };
      }
  }
  /**
   * @api {post} /assessment/api/v1/files/getImageUploadUrl Get File Upload URL
   * @apiVersion 1.0.0
   * @apiName Get File Upload URL
   * @apiGroup Files
   * @apiParamExample {json} Request-Body:
   *
   *   "files" : [
   *     "23-Oct-2018-8AM-image121.jpg",
   *     "23-Oct-2018-8AM-image222.jpg",
   *     "23-Oct-2018-8AM-image323.jpg"
   *   ],
   *   "submissionId": "5bee56b30cd752559fd13012"
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Get the url of the image upload.
   * @method
   * @name getImageUploadUrl
   * @param {Object} req -request Data.
   * @param {Array} req.body.files - image upload files.
   * @param {String} req.body.submissionId - submission id.
   * @returns {JSON} - Url generated link.
   */

  getImageUploadUrl(req) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!Array.isArray(req.body.files) || req.body.files.length < 1) {
          throw new Error(messageConstants.apiResponses.FILES_NAME_NOT_GIVEN);
        }

        const folderPath = req.body.submissionId + '/' + req.userDetails.userId + '/';

        let signedUrl = await filesHelper.getSignedUrls(folderPath, req.body.files);

        if (signedUrl.success) {
          return resolve({
            message: messageConstants.apiResponses.URL_GENERATED,
            result: signedUrl.files,
          });
        } else {
          throw new Error(signedUrl.message);
        }
      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }
	/**
	 * @api {get} /survey/v1/files/download
	 * @apiVersion 1.0.0
	 * @apiHeader {String} X-auth-token Authenticity token
	 * @apiSampleRequest /survey/v1/files/download?file=survey/77d9b0a7-f962-4f24-9fbd-cb027ada5eee/1/187aa81b-3007-4122-b5f0-ea0cc70af2fd/c56938e3-26aa-4a69-a8ef-9eaceeb0ca1b.pdf
	 * @apiUse successBody
	 * @apiUse errorBody
	 * @apiParamExample {json} Response:
	 * directly serves the file as the api response
	 */

	/**
	 * Get Downloadable URL from cloud service.
	 * @method
	 * @name download
	 * @param  {Request}  req  request body.
	 * @returns {JSON} Response with status and message.
	 */
  async download(req) {
		return new Promise(async (resolve, reject) => {
			try {
				let file = req.query.file
				let fileURL = await filesHelper.getDownloadableUrl([file])
				fileURL = fileURL.result[0].url
				return resolve({
					isResponseAStream: true,
					fileURL,
					file,
				})
			} catch (error) {
				return reject({
					status: error.status || httpStatusCode.internal_server_error.status,

					message: error.message || httpStatusCode.internal_server_error.message,

					errorObject: error,
				})
			}
		})
	}
};
