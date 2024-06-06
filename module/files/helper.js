/**
 * name : files/helper.js
 * author : Akash
 * created-date : 22-Nov-2018
 * Description : All files related helper functionality.
 */

// Dependencies

var fs = require('fs');
const moment = require('moment-timezone');
const cloudStorage = process.env.CLOUD_STORAGE && process.env.CLOUD_STORAGE != '' ? process.env.CLOUD_STORAGE : '';
const gcp = require(ROOT_PATH + '/generics/helpers/gcpFileUpload');
const aws = require(ROOT_PATH + '/generics/helpers/awsFileUpload');
const azure = require(ROOT_PATH + '/generics/helpers/azureFileUpload');
const {cloudClient} = require(ROOT_PATH+'/config/cloud-service');
const bucketName = process.env.CLOUD_STORAGE_BUCKETNAME;
let cloudStorageProvider = process.env.CLOUD_STORAGE_PROVIDER;

/**
 * FilesHelper
 * @class
 */

module.exports = class FilesHelper {
  /**
   * Create a file inside public/exports folder .
   * @method
   * @name createFileWithName
   * @param {String} name - name of the file to be created.
   * @returns {String} - file complete path.
   */

  static createFileWithName(name) {
    return new Promise(async (resolve, reject) => {
      try {
        let currentDate = new Date();
        let fileExtensionWithTime = moment(currentDate).tz('Asia/Kolkata').format('YYYY_MM_DD_HH_mm') + '.json';
        let filePath = ROOT_PATH + '/public/exports/';
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath);
        }

        return resolve(filePath + name + '_' + fileExtensionWithTime);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Write js object to json file.
   * @method
   * @name writeJsObjectToJsonFile
   * @param {String} filePath - complete filepath.
   * @param {Object} document.
   * @returns {Object}
   */

  static writeJsObjectToJsonFile(filePath, document) {
    return new Promise(async (resolve, reject) => {
      try {
        fs.writeFile(filePath, JSON.stringify(document), 'utf8', function (error) {
          if (error) {
            return reject({
              status: 500,
              message: error,
              errorObject: error,
            });
          }
          return resolve({
            isResponseAStream: true,
            fileNameWithPath: filePath,
          });
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Get the url of the file present on google cloud, in aws or in azure.
   * @method
   * @name getFilePublicBaseUrl
   * @returns {String} - file url link.
   */

  static getFilePublicBaseUrl() {
    return new Promise(async (resolve, reject) => {
      try {
        return;
        if (cloudStorage == '') {
          throw new Error(messageConstants.apiResponses.MISSING_CLOUD_STORAGE_PROVIDER);
        }

        if (cloudStorage != 'GC' && cloudStorage != 'AWS' && cloudStorage != 'AZURE') {
          throw new Error(messageConstants.apiResponses.INVALID_CLOUD_STORAGE_PROVIDER);
        }

        let fileBaseUrl = '';
        if (cloudStorage == 'GC') {
          fileBaseUrl = await gcp.getFilePublicBaseUrl();
        } else if (cloudStorage == 'AWS') {
          fileBaseUrl = await aws.getFilePublicBaseUrl();
        } else if (cloudStorage == 'AZURE') {
          fileBaseUrl = await azure.getFilePublicBaseUrl();
        }

        return resolve(fileBaseUrl);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Get all signed urls.
   * @method
   * @name getSignedUrls
   * @param {String} [folderPath = ""] - link to the folder path.
   * @param {Array} [fileNames = []] - fileNames.
   * @returns {Array} - consists of all signed urls files.
   */

  static getSignedUrls(folderPath = '', fileNames = []) {
    return new Promise(async (resolve, reject) => {
      try {
        if (folderPath == '') {
          throw new Error('File base url not given.');
        }

        if (!Array.isArray(fileNames) || fileNames.length < 1) {
          throw new Error('File names not given.');
        }

        if (cloudStorage == '') {
          throw new Error(messageConstants.apiResponses.MISSING_CLOUD_STORAGE_PROVIDER);
        }

        if (cloudStorage != 'GC' && cloudStorage != 'AWS' && cloudStorage != 'AZURE') {
          throw new Error(messageConstants.apiResponses.INVALID_CLOUD_STORAGE_PROVIDER);
        }

        let signedUrls = new Array();

        for (let pointerToFileNames = 0; pointerToFileNames < fileNames.length; pointerToFileNames++) {
          const file = fileNames[pointerToFileNames];
          let signedUrlResponse;

          if (cloudStorage == 'GC') {
            signedUrlResponse = await this.getGCBSignedUrl(folderPath, file);
          } else if (cloudStorage == 'AWS') {
            signedUrlResponse = await this.getS3SignedUrl(folderPath, file);
          } else if (cloudStorage == 'AZURE') {
            signedUrlResponse = await this.getAzureSignedUrl(folderPath, file);
          }

          if (signedUrlResponse.success) {
            signedUrls.push({
              file: file,
              url: signedUrlResponse.url,
              payload: { sourcePath: signedUrlResponse.name },
              cloudStorage: process.env.CLOUD_STORAGE,
            });
          }
        }

        if (signedUrls.length == fileNames.length) {
          return resolve({
            success: true,
            message: messageConstants.apiResponses.URL_GENERATED,
            files: signedUrls,
          });
        } else {
          return resolve({
            success: false,
            message: messageConstants.apiResponses.FAILED_PRE_SIGNED_URL,
            files: signedUrls,
          });
        }
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Get google cloud signed url.
   * @method
   * @name getGCBSignedUrl
   * @param {String} [folderPath = ""] - link to the folder path.
   * @param {Array} [fileName = ""] - name of the file.
   * @returns {Object} - signed url and gcp file name.
   */

  static getGCBSignedUrl(folderPath = '', fileName = '') {
    return new Promise(async (resolve, reject) => {
      try {
        if (folderPath == '' || fileName == '') {
          throw new Error(httpStatusCode.bad_request.status);
        }

        let noOfMinutes = 30;
        let expiry = Date.now() + noOfMinutes * 60 * 1000;

        const config = {
          action: 'write',
          expires: expiry,
          contentType: 'multipart/form-data',
        };

        let gcpFile = gcp.bucket.file(folderPath + fileName);

        const signedUrl = await gcpFile.getSignedUrl(config);

        if (signedUrl[0] && signedUrl[0] != '') {
          return resolve({
            success: true,
            message: messageConstants.apiResponses.URL_GENERATED + 'Signed.',
            url: signedUrl[0],
            name: gcpFile.name,
          });
        } else {
          return resolve({
            success: false,
            message: messageConstants.apiResponses.FAILED_SIGNED_URL,
            response: signedUrl,
          });
        }
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Get aws s3 cloud signed url.
   * @method
   * @name getS3SignedUrl
   * @param {String} [folderPath = ""] - link to the folder path.
   * @param {Array} [fileName = ""] - fileName.
   * @returns {Object} - signed url and s3 file name.
   */

  static getS3SignedUrl(folderPath = '', fileName = '') {
    return new Promise(async (resolve, reject) => {
      try {
        if (folderPath == '' || fileName == '') {
          throw new Error(httpStatusCode.bad_request.status);
        }

        let noOfMinutes = 30;
        let expiry = 60 * noOfMinutes;

        try {
          const url = await aws.s3.getSignedUrlPromise('putObject', {
            Bucket: aws.bucketName,
            Key: folderPath + fileName,
            Expires: expiry,
          });
          if (url && url != '') {
            return resolve({
              success: true,
              message: messageConstants.apiResponses.URL_GENERATED + 'Signed.',
              url: url,
              name: folderPath + fileName,
            });
          } else {
            return resolve({
              success: false,
              message: messageConstants.apiResponses.FAILED_SIGNED_URL,
              response: url,
            });
          }
        } catch (error) {
          return resolve({
            success: false,
            message: error.message,
            response: error,
          });
        }
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Get azure cloud signed url.
   * @method
   * @name getAzureSignedUrl
   * @param {String} [folderPath = ""] - link to the folder path.
   * @param {Array} [fileName = ""] - fileName.
   * @returns {Object} - signed url and azure file name.
   */

  static getAzureSignedUrl(folderPath = '', fileName = '') {
    return new Promise(async (resolve, reject) => {
      try {
        if (folderPath == '' || fileName == '') {
          throw new Error(httpStatusCode.bad_request.status);
        }

        // Create a SAS token that expires in an hour
        // Set start time to five minutes ago to avoid clock skew.
        let startDate = new Date();
        startDate.setMinutes(startDate.getMinutes() - 5);
        let expiryDate = new Date(startDate);
        expiryDate.setMinutes(startDate.getMinutes() + 60);

        try {
          const url = await azure.getSignedUrl(folderPath + fileName, startDate, expiryDate);

          if (url && url != '') {
            return resolve({
              success: true,
              message: messageConstants.apiResponses.URL_GENERATED + 'Signed.',
              url: url,
              name: folderPath + fileName,
            });
          } else {
            return resolve({
              success: false,
              message: messageConstants.apiResponses.FAILED_SIGNED_URL,
              response: url,
            });
          }
        } catch (error) {
          return resolve({
            success: false,
            message: error.message,
            response: error,
          });
        }
      } catch (error) {
        return reject(error);
      }
    });
  }
  /**
   * Get all signed urls.
   * @method
   * @name preSignedUrls
   * @param {Array} payloadData       - payload for files data.
   * @param {String} referenceType    - reference type
   * @param {String} userId           - Logged in user id.
   * @param {String} templateId       - certificateTemplateId.
   * @param {Boolean} serviceUpload     - serive Upload  {true/false}
   * @returns {Array}                 - consists of all signed urls files.
   */

  static preSignedUrls(payloadData, referenceType, userId = '', serviceUpload = false) {
    return new Promise(async (resolve, reject) => {
      try {
        let payloadIds = Object.keys(payloadData);

        let result = {
          [payloadIds[0]]: {},
        };

        let folderPath = '';

        if (referenceType == messageConstants.common.DHITI) {
          folderPath = 'reports/';
        } else if (referenceType == messageConstants.common.CERTIFICATE) {
          //  Folder path specifically for project certificates
          folderPath = 'certificateTemplates/';
        } else if (referenceType == 'baseTemplates') {
          //  Folder path specifically for project certificates
          folderPath = 'certificateBaseTemplates/';
        } else {
          folderPath = 'survey/' + payloadIds[0] + '/' + userId + '/' + gen.utils.generateUUId() + '/';
        }

        let signedUrls;
        try {
          let fileNames = payloadData[payloadIds[0]].files;
          let addDruidFileUrlForIngestion = false;
          let actionPermission = messageConstants.common.WRITE_PERMISSION;
          if (!Array.isArray(fileNames) || fileNames.length < 1) {
            throw new Error('File names not given.');
          }

          let noOfMinutes = messageConstants.common.NO_OF_MINUTES;
          let linkExpireTime = messageConstants.common.NO_OF_EXPIRY_TIME * noOfMinutes;
          // Create an array of promises for signed URLs
          // {sample response} : https://sunbirdstagingpublic.blob.core.windows.net/samiksha/reports/sample.pdf?sv=2020-10-02&st=2023-08-03T07%3A53%3A53Z&se=2023-08-03T08%3A53%3A53Z&sr=b&sp=w&sig=eZOHrBBH%2F55E93Sxq%2BHSrniCEmKrKc7LYnfNwz6BvWE%3D
          const signedUrlsPromises = fileNames.map(async (fileName) => {
            let file = folderPath && folderPath !== '' ? folderPath + fileName : fileName;
            let response = {
              file: file,
              payload: { sourcePath: file },
              cloudStorage: cloudStorageProvider.toUpperCase(),
            };
            response.downloadableUrl = await cloudClient.getDownloadableUrl(
              bucketName,
              file,
              linkExpireTime, // Link ExpireIn
            );
            if (!serviceUpload) {
              response.url = await cloudClient.getSignedUrl(
                bucketName, // bucket name
                file, // file path
                linkExpireTime, // expire
                actionPermission, // read/write
              );
            } else {
              response.url = `${process.env.PUBLIC_BASE_URL}/${messageConstants.common.UPLOAD_FILE}?file=${file}`;
            }

            if (addDruidFileUrlForIngestion) {
              // {sample response} : { type: 's3', uris: [ 's3://dev-mentoring/reports/cspSample.pdf' ] }
              let druidIngestionConfig = await cloudClient.getFileUrlForIngestion(
                bucketName, // bucket name
                file, // file path
              );
              response.inputSource = druidIngestionConfig;
            }
            return response;
          });

          // Wait for all signed URLs promises to resolve
          signedUrls = await Promise.all(signedUrlsPromises);
          result[payloadIds[0]]['files'] = signedUrls;

          return resolve({
            message: messageConstants.apiResponses.URL_GENERATED,
            data: result,
          });
        } catch (error) {
          return resolve({
            status: httpStatusCode['bad_request'].status,
            message: messageConstants.apiResponses.FAILED_PRE_SIGNED_URL,
            result: {},
          });
        }
      } catch (error) {
        return reject(error);
      }
    });
  }
  /**
   * Get Downloadable URL from cloud.
   * @method
   * @name getDownloadableUrl
   * @param {Array} payloadData       - payload for files data.
   * @returns {JSON}                  - Response with status and message.
   */

  static getDownloadableUrl(payloadData) {
    return new Promise(async (resolve, reject) => {
      try {
        
        let filePath = payloadData;
        let noOfMinutes = messageConstants.common.NO_OF_MINUTES;
        let linkExpireTime = messageConstants.common.NO_OF_EXPIRY_TIME * noOfMinutes;

        if (Array.isArray(filePath) && filePath.length > 0) {
          let result = [];

          await Promise.all(
            filePath.map(async (element) => {
              let responseObj = {
                cloudStorage: cloudStorageProvider,
              };
              responseObj.filePath = element;
              // Get the downloadable URL from the cloud client SDK.
              // {sample response} : https://sunbirdstagingpublic.blob.core.windows.net/sample-name/reports/uploadFile2.jpg?st=2023-08-05T07%3A11%3A25Z&se=2024-02-03T14%3A11%3A25Z&sp=r&sv=2018-03-28&sr=b&sig=k66FWCIJ9NjoZfShccLmml3vOq9Lt%2FDirSrSN55UclU%3D
              responseObj.url = await cloudClient.getDownloadableUrl(
                bucketName,
                element,
                linkExpireTime, // Link ExpireIn
              );
              result.push(responseObj);
            }),
          );
          return resolve({
            success: true,
            message: messageConstants.apiResponses.URL_GENERATED,
            result: result,
          });
        } else {
          let result;
          // Get the downloadable URL from the cloud client SDK.
          result = await cloudClient.getDownloadableUrl(
            bucketName, // bucket name
            filePath, // resource file path
            linkExpireTime, // Link Expire time
          );

          let responseObj = {
            filePath: filePath,
            url: result,
            cloudStorage: cloudStorageProvider,
          };
          return resolve({
            success: true,
            message: messageConstants.apiResponses.URL_GENERATED,
            result: responseObj,
          });
        }
      } catch (error) {
        return reject({
          status: error.status || httpStatusCode['internal_server_error'].status,

          message: error.message || httpStatusCode['internal_server_error'].message,

          errorObject: error,
        });
      }
    });
  }
};
