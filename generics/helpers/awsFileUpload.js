const AWS = require('aws-sdk');
const AWS_ACCESS_KEY_ID =
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_ACCESS_KEY_ID != '' ? process.env.AWS_ACCESS_KEY_ID : '';
const AWS_SECRET_ACCESS_KEY =
  process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_SECRET_ACCESS_KEY != '' ? process.env.AWS_SECRET_ACCESS_KEY : '';
const AWS_BUCKET_REGION =
  process.env.AWS_BUCKET_REGION && process.env.AWS_BUCKET_REGION != '' ? process.env.AWS_BUCKET_REGION : 'ap-south-1';
const AWS_BUCKET_ENDPOINT =
  process.env.AWS_BUCKET_ENDPOINT && process.env.AWS_BUCKET_ENDPOINT != ''
    ? process.env.AWS_BUCKET_ENDPOINT
    : 's3.ap-south-1.amazonaws.com';

// The name of the bucket that you have created
const BUCKET_NAME =
  process.env.AWS_BUCKET_NAME && process.env.AWS_BUCKET_NAME != '' ? process.env.AWS_BUCKET_NAME : 'sl-dev-storage';

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: AWS_BUCKET_REGION,
  endpoint: AWS_BUCKET_ENDPOINT,
});

// Get file public base url.
var getFilePublicBaseUrl = () => {
  return `https://${BUCKET_NAME}.${AWS_BUCKET_ENDPOINT}/`;
};
// }

module.exports = {
  bucketName: BUCKET_NAME,
  s3: s3,
  getFilePublicBaseUrl: getFilePublicBaseUrl,
};
