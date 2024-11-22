require('module-alias/register');
let fs = require('fs');
let path = require('path');
const requireAll = require('require-all');
mkdirp(path.join(__dirname + '/../logs/' + process.env.NODE_ENV));
mkdirp(path.join(__dirname + '/../' + 'uploads'));
mkdirp(path.join(__dirname + '/../' +'tmp'));
gen = Object.assign(global, {});

module.exports = function () {
  var Log = require('log');
  // let createStream = fs.createWriteStream(
  //   __dirname +
  //     "/../logs/" +
  //     process.env.NODE_ENV +
  //     "/log-" +
  //     new Date().getTime() +
  //     ".log",
  //   { flags: "w" }
  // );
  // let readStream = fs.createReadStream(__dirname +'/../logs/'+process.env.NODE_ENV + '/logs.log');
  global.async = require('async');
  global.ROOT_PATH = path.join(__dirname, '..');
  global.GENERIC_HELPERS_PATH = '@helpers';
  global.MODULES_BASE_PATH = '@module';
  global.DB_QUERY_BASE_PATH = '@dbQueries';
  global.log = new Log(global.config.log);
  global._ = require('lodash');
  gen.utils = require('@helpers/utils');
  global.config = require('.');

  global.httpStatusCode = require('@generics/httpStatusCodes');

  // global.ENABLE_DEBUG_LOGGING = process.env.ENABLE_DEBUG_LOGGING || 'ON';
  // global.ENABLE_BUNYAN_LOGGING = process.env.ENABLE_BUNYAN_LOGGING || 'ON';

  global.REQUEST_TIMEOUT_FOR_REPORTS = process.env.REQUEST_TIMEOUT_FOR_REPORTS || 120000;

  // boostrap all models
  global.models = requireAll({
    dirname: path.resolve('models'),
    filter: /(.+)\.js$/,
    resolve : (Model) => Model
  });

  //load base v1 controllers
  const pathToV1Controllers = path.resolve('controllers/v1/')
  const pathToV2Controllers = path.resolve('controllers/v2/')
  fs.readdirSync(pathToV1Controllers).forEach( (file) => {
    checkWhetherFolderExistsOrNor(path.join(pathToV1Controllers + '/') ,  file);
  });
  
  //load base v2 controllers
  fs.readdirSync(pathToV2Controllers).forEach( (file) => {
    checkWhetherFolderExistsOrNor(path.join(pathToV1Controllers + '/'), file);
  });
  
  function checkWhetherFolderExistsOrNor(pathToFolder, file) {
    let folderExists = fs.lstatSync(pathToFolder + file).isDirectory();
    if (folderExists) {
      fs.readdirSync(path.join(pathToFolder , file)).forEach(function (folderOrFile) {
        checkWhetherFolderExistsOrNor(path.join(pathToFolder ,file ,'/'), folderOrFile);
      });
    } else {
      if (file.match(/\.js$/) !== null) {
        require(pathToFolder + file);
      }
    }
  }
  
  //load schema files
  fs.readdirSync(path.resolve('models')).forEach( (file) => {
    if (file.match(/\.js$/) !== null) {
      var name = file.replace('.js', '');
      global[name + 'Schema'] = require(path.resolve('models' , file));
    }
  });

  // boostrap all controllers
  global.controllers = requireAll({
    dirname: path.resolve('controllers'),
    filter: /(.+Controller)\.js$/,
    resolve: function (Controller) {
      if (Controller.name) return new Controller(models[Controller.name]);
      // else return new Controller();
    },
  });

  // Load all message constants
  global.messageConstants = {};

  fs.readdirSync(path.resolve('generics/messageConstants')).forEach(function (file) {
    if (file.match(/\.js$/) !== null) {
      let name = file.replace('.js', '');
      global.messageConstants[name] = require(path.resolve('generics/messageConstants' , file));
    }
  });

  // Load all kafka consumer files
  fs.readdirSync(path.resolve('generics/kafkaConsumers/')).forEach(function (file) {
    if (file.match(/\.js$/) !== null) {
      var name = file.replace('Consumer.js', '');
      console.log(name,'###')
      console.log(name + 'Consumer','<--###')
      console.log(file,'file###')
      global[name + 'Consumer'] = require(path.resolve('generics/kafkaConsumers/' , file));
    }
  });

  global.sessions = {};

  // const libraryCategoriesHelper = require(MODULES_BASE_PATH + '/library/categories/helper');

  // (async () => {
  //   await libraryCategoriesHelper.setLibraryCategories();
  // })();
};

function mkdirp(dir, exist = '', state = 1) {
  if (dir != exist) {
    let path = dir.split('/');
    exist = exist + '/' + path[state];
    path = path.slice(state + 1, path.length);
    if (fs.existsSync(exist)) {
      mkdirp(dir, exist, ++state);
    } else {
      fs.mkdirSync(exist);
      mkdirp(dir, exist, ++state);
    }
  }
}