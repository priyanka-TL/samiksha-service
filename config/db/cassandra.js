/*
 * Module           : Cassandra connections
 * Source filename  : cassandra.js
 * Description      : Cassandra connection setup
 * Author           : Aman
 */

// Dependencies

var ExpressCassandra = require('express-cassandra');

/**
 * Cassandra connection setup.
 * @method
 * @name DB
 * @param {Object} config  - configuration data for cassandra db.
 * @return Model
 */

var DB = function (config) {
  var models = ExpressCassandra.createClient({
    clientOptions: {
      contactPoints: [config.host],
      protocolOptions: { port: config.port },
      keyspace: config.keyspace,
      queryOptions: { consistency: ExpressCassandra.consistencies.one },
    },
    ormOptions: {
      defaultReplicationStrategy: {
        class: 'SimpleStrategy',
        replication_factor: 1,
      },
      migration: 'safe',
    },
  });

  var createModel = function (opts) {
    var MyModel = models.loadSchema(opts.name, opts.schema);
    MyModel.syncDB(function (err, result) {
      if (err) throw err;
      log.debug('Connected to cassandra database!');
    });
    return models.instance;
  };
  return {
    models: models.instance,
    createModel: createModel,
  };
};
module.exports = DB;
