/**
 * name : elasticSearch.js
 * author : Aman Jung Karki
 * created-date : 11-Jun-2020
 * Description : Elastic search configuration file.
 */

//dependencies
const { Client: esClient } = require('@elastic/elasticsearch');

/**
 * Elastic search connection.
 * @function
 * @name connect
 * @param {Object} config Elastic search configurations.
 * @return {Object} elastic search client
 */

var connect = function (config) {
  if (process.env.ELASTICSEARCH_COMMUNICATIONS_ON_OFF === 'ON') {
    const elasticSearchClient = new esClient({
      node: 'http://localhost:1000',
      maxRetries: process.env.ELASTIC_SEARCH_MAX_RETRIES,
      requestTimeout: process.env.ELASTIC_SEARCH_REQUEST_TIMEOUT,
      sniffOnStart: process.env.ELASTIC_SEARCH_SNIFF_ON_START,
    });

    elasticSearchClient.ping({}, function (error) {
      if (error) {
        console.error(error);
        log.error('Elasticsearch cluster is down!');
      } else {
        log.debug('Elasticsearch connection established.');
      }
    });

    return {
      client: elasticSearchClient,
    };
  }
  return null;
};

module.exports = connect;
