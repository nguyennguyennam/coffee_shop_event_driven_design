const fs = require('fs');
const path = require('path');
const http = require('http');
const { consumer } = require('./kafka');
const ORDERS_FILE = path.join(__dirname, 'orders.json'); // Vẫn là orders.json


// Hàm đọc/ghi file (giúp code sạch hơn)
async function readOrdersFromFile() {
    try {
        return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    } catch (e) {
        // Log warning but return empty array if file not found or invalid JSON
        console.warn(`[Worker] Could not read or parse ${ORDERS_FILE}. Returning empty orders list.`);
        return [];
    }
}

async function writeOrdersToFile(orders) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
}

// Hàm này để TẠO MỚI order hoặc CẬP NHẬT nếu nó đã tồn tại trong orders.json
// Event từ order-status-updated bây giờ được giả định là có đầy đủ thông tin
async function createOrUpdateOrderInOrdersFile(orderData) {
    let orders = await readOrdersFromFile();
    const existingIndex = orders.findIndex(o => o.orderId === orderData.orderId);

    if (existingIndex !== -1) {
        // Order đã tồn tại, cập nhật nó với tất cả thông tin mới nhận được
        const existingOrder = orders[existingIndex];
        const updatedOrder = { 
            ...existingOrder, // Giữ lại các trường cũ chưa bị ghi đè
            ...orderData,     // Ghi đè bằng các trường mới từ event
            // Các trường đặc biệt chỉ nên được cập nhật nếu có trong orderData mới
            shipperId: orderData.shipperId !== undefined ? orderData.shipperId : existingOrder.shipperId,
            claimedAt: orderData.claimedAt !== undefined ? orderData.claimedAt : existingOrder.claimedAt,
            // Đảm bảo status được cập nhật chính xác nếu có newStatus trong event
            status: orderData.status || existingOrder.status 
        };
        orders[existingIndex] = updatedOrder;
        console.log(`✅ [Worker] Cập nhật order ${orderData.orderId} trong ${ORDERS_FILE} (trạng thái: ${updatedOrder.status || 'unknown'})`);
    } else {
        // Order KHÔNG tồn tại, TẠO MỚI nó từ thông tin đầy đủ trong event
        // Event từ order-status-updated bây giờ có đầy đủ các trường OrderPlaced
        const newOrder = {
            orderId: orderData.orderId,
            customerId: orderData.customerId || null,
            orderDate: orderData.orderDate || new Date().toISOString(),
            status: orderData.status || 'Pending', // Hoặc event.newStatus nếu có
            orderItems: orderData.orderItems || [],
            price: orderData.price || 0,
            shipperId: orderData.shipperId || null,
            claimedAt: orderData.claimedAt || null,
            // Thêm các trường khác từ event nếu có (eventId, eventVersion, occured, $type)
            eventId: orderData.eventId || null,
            eventVersion: orderData.eventVersion || null,
            occured: orderData.occured || null,
            $type: orderData.$type || 'OrderUpdatedForShipper' // Có thể đặt type mới cho dữ liệu này
        };
        orders.unshift(newOrder); // Thêm vào đầu danh sách
        console.log(`✅ [Worker] TẠO MỚI order ${orderData.orderId} trong ${ORDERS_FILE} (trạng thái: ${newOrder.status || 'unknown'})`);
    }
    await writeOrdersToFile(orders);
    return true; // Luôn thành công khi tạo hoặc cập nhật
}

// Hàm để xóa order khi nó được giao (nếu bạn muốn xóa khỏi danh sách chờ trong orders.json)
async function removeOrderFromOrdersFile(orderId) {
    let orders = await readOrdersFromFile();
    const initialLength = orders.length;
    const filteredOrders = orders.filter(o => o.orderId !== orderId);
    if (filteredOrders.length < initialLength) {
        await writeOrdersToFile(filteredOrders);
        console.log(`✅ [Worker] Đã xóa đơn hàng ${orderId} khỏi ${ORDERS_FILE}.`);
        return true;
    } else {
        console.log(`⚠️ [Worker] Không tìm thấy đơn hàng ${orderId} trong ${ORDERS_FILE} để xóa.`);
        return false;
    }
}

module.exports = {
    consumer,
    createOrUpdateOrderInOrdersFile,
    removeOrderFromOrdersFile,
    readOrdersFromFile
};