require('dotenv').config({ path: '../.env' });
global.config = require('../config');
require('../config/globalVariable')();
const ConfigurationsHelper = require(MODULES_BASE_PATH+"/configurations/helper");
let environmentData = require('../envVariables')();
let code = 'keysAllowedForTargeting';

let profileKeys = [
  'state',
  'district',
  'school',
  'block',
  'cluster',
  'board',
  'class',
  'roles',
  'entities',
  'entityTypeId',
  'entityType',
  'subject',
  'medium',
];

async function addDefaultRecords() {
  try {
    let count = await database.models.configurations.countDocuments();

    if (count == 0) {
      console.log('No records found in the database.');
        await ConfigurationsHelper.createOrUpdate(code,profileKeys)
    }

    console.log('Script ran successfully')
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addDefaultRecords();
