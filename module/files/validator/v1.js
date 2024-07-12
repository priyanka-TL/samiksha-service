module.exports = (req) => {
  let filesValidator = {
    getImageUploadUrl: function () {
      req.checkBody('submissionId').exists().withMessage('submission id is required');
      req.checkBody('files').exists().withMessage('files is required');
    },
    preSignedUrls: function () {
      req.checkBody('request').exists().withMessage('request data is required');
      req.checkBody('ref').exists().withMessage('required reference type');
    },
    getDownloadableUrl: function () {
      req.checkBody('filePaths').exists().withMessage("files data is required");
      req.checkBody('filePaths').isArray().withMessage("files should be an array");
      req.checkBody('filePaths').notEmpty().withMessage("files array should not be empty");
    },
  };

  if (filesValidator[req.params.method]) filesValidator[req.params.method]();
};
