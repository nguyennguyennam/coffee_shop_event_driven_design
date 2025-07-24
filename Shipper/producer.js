const axios = require('axios');

const fs = require('fs');
const path = require('path');
const { consumer, producer, startProducer } = require('./kafka');


const ORDERS_FILE = path.join(__dirname, 'orders.json');



const DOTNET_API_BASE_URL = 'http://localhost:5079/api';

async function updateOrderStatus(orderId, newStatus, shipperId) {
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
                return { ...order, status: newStatus, shipperId: shipperId, claimedAt: order.claimedAt || null };
            }
            return order;
        });

        if (found) {
            fs.writeFileSync(ORDERS_FILE, JSON.stringify(updatedOrders, null, 2), 'utf8');
            console.log(`✅ Cập nhật đơn hàng ${orderId} sang trạng thái "${newStatus}" trong file orders.json`);
        } else {
            console.log(`⚠️ Không tìm thấy đơn hàng ${orderId} trong file để cập nhật.`);
        }

    } catch (err) {
        console.error(`❌ Lỗi khi cập nhật trạng thái đơn hàng:`, err.message || err);
    }
}

async function sendUpdateOrderStatusRequest(orderId, NewStatus, shipperId) {
    try {
        console.log(`🌐 Gửi yêu cầu cập nhật trạng thái Order: ${orderId} thành '${NewStatus}' tới .NET Backend`);
        const response = await axios.post(`${DOTNET_API_BASE_URL}/Order/${orderId}/status`, {
            newStatus: NewStatus
        });

        updateOrderStatus(orderId, NewStatus, shipperId); // Cập nhật trạng thái đơn hàng trong file orders.json

        console.log('✅ Đã gửi yêu cầu cập nhật trạng thái thành công:', response.data);
        return response.data;
    } catch (apiErr) {
        console.error('❌ Lỗi khi gửi yêu cầu cập nhật trạng thái Order tới .NET Backend:', apiErr.message || apiErr);
        if (apiErr.response) {
            console.error('Response data:', apiErr.response.data);
            console.error('Response status:', apiErr.response.status);
        }
        throw apiErr;
    }
}

async function claimOrder(orderId, shipperId) {
    try {
        await startProducer(); // Đảm bảo producer đã được khởi động
        updateOrderStatus(orderId, "OrderClaimed", shipperId); // Cập nhật trạng thái đơn hàng trong file orders.json
        await producer.send({
        topic: 'order-claimed',
        messages: [
            {
            key: orderId,
            value: JSON.stringify({
                orderId,
                shipperId,
                claimedAt: new Date().toISOString(),
            }),
            },
        ],
        });
        console.log(`✅ Đã gửi yêu cầu claim Order ${orderId} cho shipper ${shipperId}`);
        return true;
    } catch (err) {
        console.error(`❌ Lỗi khi gửi yêu cầu claim Order ${orderId}:`, err.message || err);
        return false;
    }
}   

module.exports = { sendUpdateOrderStatusRequest, claimOrder };