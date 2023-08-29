/**
 * Project          : Shikshalokam-Assessment
 * Module           : Configuration
 * Source filename  : index.js
 * Description      : Environment related configuration variables
 * Copyright        : Copyright © 2018
 *                    Written under contract by Above Solutions Pvt. Ltd.
 * Author           : Yogesh Sinoriya <yogesh.sinoriya@above-inc.com>
 */

/**
 * Mongodb Database configuration.
 * @method
 * @name db_connect
 * @param {Object} configData  - configuration data for mongodb.
 */

let db_connect = function (configData) {
  global.database = require('./dbConfig')(configData.DB_Config.connection.mongodb);
  global.ObjectId = database.ObjectId;
  global.Abstract = require('../generics/abstract');
};

/**
 * Cassandra Database configuration.
 * @method
 * @name cassandra_connect
 * @param {Object} cassandraConfigurationData  - configuration data for cassandra.
 */

let cassandra_connect = function (cassandraConfigurationData) {
  global.cassandraDatabase = require('./db/cassandra')(cassandraConfigurationData);
  if (!global.Abstract) {
    global.Abstract = require('../generics/abstract');
  }
};

/**
 * Elastic search configuration.
 * @function
 * @name elasticsearch_connect
 * @param {Object} elasticSearchConfigurations  - elastic search configuration.
 */

let elasticsearch_connect = function (elasticSearchConfigurations) {
  global.elasticsearch = require('./db/elasticSearch')(elasticSearchConfigurations);
};

/**
 * Kafka connection information.
 * @method
 * @name kafka_connect
 * @param {Object} configData  - configuration data for kafka.
 */

let kafka_connect = function (configData) {
  global.kafkaClient = require('./kafkaConfig')(configData.Kafka_Config);
};

const configuration = {
  root: require('path').normalize(__dirname + '/..'),
  app: {
    name: 'sl-assessment-api',
  },
  host: process.env.HOST || 'http://localhost',
  port: process.env.PORT || 4201,
  log: process.env.LOG || 'debug',
  DB_Config: {
    connection: {
      mongodb: {
        host: process.env.MONGODB_URL || 'mongodb://localhost:27017',
        user: '',
        pass: '',
        database: process.env.DB || 'sl-assessment',
        options: {
          useNewUrlParser: true,
        },
      },
      cassandra: {
        host: process.env.CASSANDRA_HOST,
        port: process.env.CASSANDRA_PORT,
        keyspace: process.env.CASSANDRA_DB,
      },
      elasticSearch: {
        host: process.env.ELASTICSEARCH_HOST_URL,
      },
    },
    plugins: {
      timestamps: true,
      elasticSearch: false,
      softDelete: true,
      autoPopulate: false,
      timestamps_fields: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      },
    },
  },
  Kafka_Config: {
    host: process.env.KAFKA_URL || '10.160.0.8:9092',
    consumerTopics: {
      submissionRatingQueueTopic: process.env.SUBMISSION_RATING_QUEUE_TOPIC || 'sl-submissions-rating-dev',
    },
  },
  version: '1.0.0',
  URLPrefix: '/api/v1',
  webUrl: 'https://dev.shikshalokam.org',
};

db_connect(configuration);

kafka_connect(configuration);

// cassandra_connect(configuration.DB_Config.connection.cassandra);

// elasticsearch_connect(configuration.DB_Config.connection.elasticSearch);

module.exports = configuration;
