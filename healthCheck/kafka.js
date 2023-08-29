/**
 * name : kafka.js.
 * author : Aman Karki.
 * created-date : 02-Feb-2021.
 * Description : kafka health check.
 */

// Dependencies
const kafka = require('kafka-node');

function health_check() {
  return new Promise(async (resolve, reject) => {
    const client = new kafka.KafkaClient({
      kafkaHost: process.env.KAFKA_URL,
    });

    const producer = new kafka.Producer(client);

    producer.on('error', function (err) {
      return resolve(false);
    });
    producer.on('ready', function () {
      client.close();
      return resolve(true);
    });
  });
}

module.exports = {
  health_check: health_check,
};
