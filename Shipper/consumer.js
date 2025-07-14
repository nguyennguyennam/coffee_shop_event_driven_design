const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');

const kafka = new Kafka({
    clientId: 'shipper-service',
    brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'shipper-group' });
const ORDERS_FILE = path.join(__dirname, 'orders.json');

async function updateOrdersFile(newOrderList) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(newOrderList, null, 2), 'utf8');
}

async function runConsumer(io) {
    await consumer.connect();
    await consumer.subscribe({ topic: 'order-events', fromBeginning: true });

    console.log('Shipper service started, waiting for orders...\n');

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const value = message.value.toString();
            console.log(`Received message from "${topic}": ${value}`);

            try {
                const event = JSON.parse(value);
                const orderId = event.orderId;

                let currentOrders = [];
                try {
                    currentOrders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
                    currentOrders = currentOrders.filter(o => o.$type === 'OrderPlaced' || o.eventType === 'OrderPlaced');
                } catch (e) {
                    console.warn(`WARN: Could not read or parse ${ORDERS_FILE}. Starting with empty orders list.`);
                }

                let updatedOrders = [...currentOrders];

                if (event.$type === 'OrderPlaced' || event.eventType === 'OrderPlaced') {
                    if (!updatedOrders.some(o => o.orderId === orderId)) {
                        const newOrder = {
                            orderId: event.orderId,
                            customerId: event.customerId,
                            orderDate: event.orderDate,
                            status: event.status || 'Pending',
                            orderItems: event.orderItems,
                            price: event.price
                        };
                        updatedOrders.unshift(newOrder);
                        console.log(`Đã thêm đơn hàng mới vào danh sách: ${orderId}`);
                        io.emit('newOrder', newOrder);
                        console.log('Gửi socket newOrder đến shipper');
                    } else {
                        console.log(`Đơn hàng ${orderId} đã tồn tại trong danh sách, bỏ qua.`);
                    }
                } else if (event.$type === 'OrderDelivered' || event.eventType === 'OrderDelivered') {
                    const initialLength = updatedOrders.length;
                    updatedOrders = updatedOrders.filter(o => o.orderId !== orderId);
                    if (updatedOrders.length < initialLength) {
                        console.log(`Đã xóa đơn hàng đã giao khỏi danh sách: ${orderId}`);
                        io.emit('orderDeliveredUI', { orderId: orderId });
                    } else {
                        console.log(`Đơn hàng ${orderId} (đã giao) không tìm thấy trong danh sách, bỏ qua.`);
                    }
                } else {
                    console.log(`Event type không xác định: ${event.$type || event.eventType}`);
                }

                await updateOrdersFile(updatedOrders);

            } catch (err) {
                console.error('Error processing message:', err.message || err);
                console.error('Raw message that caused error:', value);
            }
        },
    });
}
  
module.exports = { runConsumer };