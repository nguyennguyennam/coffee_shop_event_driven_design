const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');

const kafka = new Kafka({
  clientId: 'shipper-service',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

const ORDERS_FILE = path.join(__dirname, 'orders.json');

async function sendOrderDeliveredEvent(orderId) {
  await producer.connect();

  const event = {
    eventType: 'OrderDelivered',
    orderId: orderId,
    deliveredAt: new Date().toISOString(),
  };

  await producer.send({
    topic: 'order-events',
    messages: [
      {
        key: orderId,
        value: JSON.stringify(event),
      },
    ],
  });

  console.log(`🚚✅ Gửi sự kiện OrderDelivered cho orderId ${orderId}`);

  await producer.disconnect();

}

module.exports = { sendOrderDeliveredEvent };
