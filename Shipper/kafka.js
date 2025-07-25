const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'shipper-service',
    brokers: ['localhost:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'shipper-group' }); // <-- Đảm bảo groupId là 'shipper-group'

let isProducerConnected = false;

const startProducer = async () => {
  if (!isProducerConnected) {
    await producer.connect();
    isProducerConnected = true;
    console.log("✅ Producer connected");
  }
};

module.exports = { consumer, producer, startProducer };