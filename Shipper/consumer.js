const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');

const kafka = new Kafka({
    clientId: 'shipper-service',
    brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'shipper-group' });
const ORDERS_FILE = path.join(__dirname, 'orders.json');

async function addOrderToFile(newOrder) {
    let orders = [];
    try {
        orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    } catch (e) {
        console.warn(`Could not read orders.json. Creating new file.`);
    }

    const exists = orders.some(o => o.orderId === newOrder.orderId);
    if (!exists) {
        orders.unshift(newOrder); // thêm vào đầu danh sách
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
        console.log(`✅ Ghi thêm order ${newOrder.orderId} vào file orders.json`);
    } else {
        console.log(`⚠️ Đơn hàng ${newOrder.orderId} đã tồn tại trong file, không ghi lại.`);
    }
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        let orders = [];
        try {
            orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
        } catch (e) {
            console.warn(`Không thể đọc orders.json. File có thể chưa tồn tại.`);
            return;
        }

        let found = false;
        const updatedOrders = orders.map(order => {
            if (order.orderId === orderId) {
                found = true;
                return { ...order, status: newStatus };
            }
            return order;
        });

        if (found) {
            fs.writeFileSync(ORDERS_FILE, JSON.stringify(updatedOrders, null, 2), 'utf8');
            console.log(`✅ Cập nhật đơn hàng ${orderId} sang trạng thái "${newStatus}" trong file orders.json`);
            return true;
        } else {
            console.log(`⚠️ Không tìm thấy đơn hàng ${orderId} trong file để cập nhật.`);
            return false;
        }

    } catch (err) {
        console.error(`❌ Lỗi khi cập nhật trạng thái đơn hàng:`, err.message || err);
        return false;
    }
}

async function runConsumer(io) {
    await consumer.connect();
    // Subscribe to both topics
    await consumer.subscribe({ topic: 'order-events', fromBeginning: true });
    await consumer.subscribe({ topic: 'order-status-updated', fromBeginning: true });

    console.log('Shipper service started, waiting for orders...\n');

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const value = message.value.toString();
            console.log(`Received message from "${topic}": ${value}`);

            try {
                const event = JSON.parse(value);
                const orderId = event.orderId;

                if (topic === 'order-status-updated') {
                    if (event.$type === 'OrderStatusUpdated' && event.newStatus === 'Payment') {
                        const success = await updateOrderStatus(orderId, 'Payment');
                        if (success) {
                            io.emit('orderPaymentUpdated', { orderId: orderId, status: 'Payment' });
                            console.log(`Gửi socket orderPaymentUpdated đến shipper cho đơn hàng ${orderId}`);
                        }
                    }
                    return; // Skip the rest if it's a status update
                }

                // Original logic for order-events topic
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
                        await addOrderToFile(newOrder);
                    } else {
                        console.log(`Đơn hàng ${orderId} đã tồn tại trong danh sách, bỏ qua.`);
                    }
                } else if (event.$type === 'OrderDelivered' || event.eventType === 'OrderDelivered') {
                    const initialLength = updatedOrders.length;
                    updatedOrders = updatedOrders.filter(o => o.orderId !== orderId);
                    if (updatedOrders.length < initialLength) {
                        console.log(`Đã xóa đơn hàng đã giao khỏi danh sách: ${orderId}`);
                        io.emit('orderDeliveredUI', { orderId: orderId });
                        await updateOrderStatus(orderId, 'Delivered');
                    } else {
                        console.log(`Đơn hàng ${orderId} (đã giao) không tìm thấy trong danh sách, bỏ qua.`);
                    }
                } else {
                    console.log(`Event type không xác định: ${event.$type || event.eventType}`);
                }

            } catch (err) {
                console.error('Error processing message:', err.message || err);
                console.error('Raw message that caused error:', value);
            }
        },
    });
}
  
module.exports = { runConsumer };