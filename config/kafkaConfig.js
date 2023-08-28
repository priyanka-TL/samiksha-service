//dependencies
const kafka = require('kafka-node')

var connect = function(config) {

    Producer = kafka.Producer
    KeyedMessage = kafka.KeyedMessage
    client = new kafka.KafkaClient({
      kafkaHost : config.host
    })

    client.on('error', function(error) {
      console.error.bind(console, "kafka connection error!")
    });

    producer = new Producer(client)

    producer.on('ready', function () {
      log.debug("Connected to Kafka");
    });
   
    producer.on('error', function (err) {
      console.error.bind(console, "kafka producer creation error!")
    })

    if(config.consumerTopics["submissionRatingQueueTopic"] && config.consumerTopics["submissionRatingQueueTopic"] != "") {

        let consumer = new kafka.ConsumerGroup(
          {
              kafkaHost : config.host,
              groupId : process.env.KAFKA_GROUP_ID,
              autoCommit : true
          },
          config.consumerTopics["submissionRatingQueueTopic"]
          ); 

        consumer.on('message', async function (message) {
          submissionRatingQueueConsumer.messageReceived(message)
        });

        consumer.on('error', async function (error) {
          submissionRatingQueueConsumer.errorTriggered(error)
        });

    }

    return {
      kafkaProducer: producer,
      kafkaClient: client,
      kafkaKeyedMessage: KeyedMessage
    };

};

module.exports = connect;
