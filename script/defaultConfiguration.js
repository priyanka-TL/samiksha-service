/*
This Node.js script is designed to add default records to the configurations collection in the database,
 specifically targeting the initial setup of configuration keys. 
 The script checks if there are any existing records in the collection.
  If none are found, it will insert a predefined set of keys that are used for targeting purposes. 
  This ensures that the necessary configuration is in place for the application to function correctly.
*/

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
