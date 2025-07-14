const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');

const kafka = new Kafka({
  clientId: 'shipper-service',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'shipper-group' });

const ORDERS_FILE = path.join(__dirname, 'orders.json');

async function saveOrder(order) {
  let data = [];

  try {
    data = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  } catch (_) {}

  data.push(order);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(data, null, 2));
}

async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-events', fromBeginning: true });

  console.log('📦 Shipper service started, waiting for orders...\n');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log(`📥 Received message from "${topic}": ${value}`);

      try {
        const payload = JSON.parse(value);
        await saveOrder(payload);
        console.log('✅ Order saved');
      } catch (err) {
        console.error('❌ Error processing message', err);
      }
    },
  });
}

module.exports = { runConsumer };