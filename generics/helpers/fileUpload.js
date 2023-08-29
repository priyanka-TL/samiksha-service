const crypto = require('crypto');

let File = function (path) {
  this.path = path;
  File.prototype.save = function (files, filename = false, path = this.path) {
    return new Promise((resolve, reject) => {
      let newname, ext;
      let names = Object.keys(files);
      let f = 0;
      let savedfiles = [];
      let failedFiles = [];

      async.forEach(
        names,
        function (name, callback) {
          //create fileName
          let hash = crypto
            .createHash('md5')
            .update(new Date().getTime() + ++f + '')
            .digest('hex');

          if (!filename) newname = hash + '.' + files[name].name.split('.')[1];
          else newname = files[name].name;

          let fielUrl = path + '/' + newname;

          files[name].mv(fielUrl, function (err) {
            if (err) {
              console.error('Error in file upload ', err);
              failedFiles.push({ tag: name });
            } else {
              savedfiles.push({ url: fielUrl, tag: name });
            }
            callback(null);
          });
        },
        function (err) {
          if (err) reject(err);
          resolve({ uploads: savedfiles, failedDocs: failedFiles });
        },
      );
    });
  };
};

module.exports = File;
