require('module-alias/register');
require('dotenv').config();

//express
const express = require('express');
let app = express();
const { elevateLog } = require("elevate-logger");
const logger = elevateLog.init();
// Health check
require('@healthCheck')(app);

//config and routes
global.config = require('@config');
require('./config/globalVariable')();
let environmentData = require('./envVariables')();
if (!environmentData.success) {
  logger.error('Server could not start . Not all environment variable is provided');
  process.exit();
}

let router = require('@routes');

//required modules
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
var fs = require('fs');
var path = require('path');
var expressValidator = require('express-validator');

//To enable cors
app.use(cors());
app.use(expressValidator());

//health check
app.get('/ping', (req, res) => {
  res.send('pong!');
});

app.use(fileUpload());
app.use(bodyParser.json({ limit: '50MB' }));
app.use(bodyParser.urlencoded({ limit: '50MB', extended: false }));
app.use(express.static('public'));

fs.existsSync('logs') || fs.mkdirSync('logs');

const serviceBaseUrl = process.env.APPLICATION_BASE_URL || '/assessment/';


app.get(process.env.API_DOC_URL, function (req, res) {
	res.sendFile(path.join(__dirname, './api-doc/index.html'))
})

// const observationSubmissionsHtmlPath = process.env.OBSERVATION_SUBMISSIONS_HTML_PATH
//   ? process.env.OBSERVATION_SUBMISSIONS_HTML_PATH
//   : 'observationSubmissions';
// app.use(express.static(observationSubmissionsHtmlPath));
// app.get(serviceBaseUrl + observationSubmissionsHtmlPath + '/*', (req, res) => {
//   let urlArray = req.path.split('/');
//   urlArray.splice(0, 3);
//   res.sendFile(path.join(__dirname, '/public/' + observationSubmissionsHtmlPath + '/' + urlArray.join('/')));
// });

//API documentation (apidoc)
// if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'local') {
//   app.use(express.static('apidoc'));
//   if (process.env.NODE_ENV == 'local') {
//     app.get('/apidoc', (req, res) => {
//       res.sendFile(path.join(__dirname, '/public/apidoc/index.html'));
//     });
//   } else {
//     app.get(serviceBaseUrl + 'apidoc/*', (req, res) => {
//       let urlArray = req.path.split('/');
//       urlArray.splice(0, 3);
//       res.sendFile(path.join(__dirname, '/public/apidoc/' + urlArray.join('/')));
//     });
//   }
// }

// app.get(serviceBaseUrl+"web/*", function(req, res) {
//   res.sendFile(path.join(__dirname, "/public/assessment/web/index.html"));
// });

// app.get(serviceBaseUrl + 'web2/*', function (req, res) {
//   res.sendFile(path.join(__dirname, '/public' + serviceBaseUrl + 'web2/index.html'));
// });

// var bunyan = require('bunyan');

// global.loggerObj = bunyan.createLogger({
//   name: 'foo',
//   streams: [
//     {
//       type: 'rotating-file',
//       path: path.join(__dirname + '/logs/' + process.pid + '-all.log'),
//       period: '1d', // daily rotation
//       count: 3, // keep 3 back copies
//     },
//   ],
// });

// global.loggerExceptionObj = bunyan.createLogger({
//   name: 'exceptionLogs',
//   streams: [
//     {
//       type: 'rotating-file',
//       path: path.join(__dirname + '/logs/' + process.pid + '-exception.log'),
//       period: '1d', // daily rotation
//       count: 3, // keep 3 back copies
//     },
//   ],
// });

// app.all('*', (req, res, next) => {
//   if (ENABLE_BUNYAN_LOGGING === 'ON') {
//     loggerObj.info({
//       method: req.method,
//       url: req.url,
//       headers: req.headers,
//       body: req.body,
//     });
//   }

//   if (ENABLE_DEBUG_LOGGING === 'ON') {
//     log.info('-------Request log starts here------------------');
//     log.info('%s %s on %s from ', req.method, req.url, new Date(), req.headers['user-agent']);
//     log.info('Request Headers: ', req.headers);
//     log.info('Request Body: ', req.body);
//     log.info('Request Files: ', req.files);
//     log.info('-------Request log ends here------------------');
//   }

//   next();
// });

//add routing
router(app);
//listen to given port
app.listen(config.port, () => {
  log.info('Environment: ' + (process.env.NODE_ENV ? process.env.NODE_ENV : 'development'));

  log.info('Application is running on the port:' + config.port);
});