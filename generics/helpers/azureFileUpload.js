const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } = require('@azure/storage-blob');
const AZURE_ACCOUNT_NAME = (process.env.AZURE_ACCOUNT_NAME && process.env.AZURE_ACCOUNT_NAME != "") ? process.env.AZURE_ACCOUNT_NAME : "";
const AZURE_ACCOUNT_KEY = (process.env.AZURE_ACCOUNT_KEY && process.env.AZURE_ACCOUNT_KEY != "") ? process.env.AZURE_ACCOUNT_KEY : "";

// The name of the container that the files will be uploaded to.
const AZURE_STORAGE_CONTAINER = (process.env.AZURE_STORAGE_CONTAINER && process.env.AZURE_STORAGE_CONTAINER != "") ? process.env.AZURE_STORAGE_CONTAINER : "sl-dev-storage";

let blobServiceClient;

let containerClient;

( async () => {

  const sharedKeyCredential = new StorageSharedKeyCredential(AZURE_ACCOUNT_NAME, AZURE_ACCOUNT_KEY);

  // Create the BlobServiceClient object which will be used to create a container client
  blobServiceClient = new BlobServiceClient(
    `https://${AZURE_ACCOUNT_NAME}.blob.core.windows.net`,
    sharedKeyCredential
  );

  // Get a reference to a container
  containerClient = await blobServiceClient.getContainerClient(AZURE_STORAGE_CONTAINER);

  const checkIfContainerExists = await containerClient.exists();

  if(!checkIfContainerExists) {
    // Create the container
    const createContainerResponse = await containerClient.create();
  }

}) ();

// Get file public base url.
var getFilePublicBaseUrl = () => {
  return `https://${AZURE_ACCOUNT_NAME}.blob.core.windows.net/` + AZURE_STORAGE_CONTAINER + "/";
};
// }

const getSignedUrl = function (fileNameWithPath, startsOn, expiresOn) {

    let sasToken = generateBlobSASQueryParameters({
        containerName : AZURE_STORAGE_CONTAINER,
        blobName : fileNameWithPath,
        permissions: BlobSASPermissions.parse("w"),
        startsOn: startsOn,
        expiresOn: expiresOn,
      },
      blobServiceClient.credential
    ).toString();

    return containerClient.url + "/" + fileNameWithPath + "?" + sasToken;
}

module.exports = {
  getSignedUrl : getSignedUrl,
  getFilePublicBaseUrl : getFilePublicBaseUrl
};
