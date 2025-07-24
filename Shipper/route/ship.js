const express = require('express');
const fs = require('fs');
const path = require('path');
const { sendUpdateOrderStatusRequest } = require('../producer');

const router = express.Router();

// Hiển thị danh sách đơn hàng
router.get('/', (req, res) => {
    let orders = [];
    try {
        orders = JSON.parse(fs.readFileSync(path.join(__dirname, '../orders.json'), 'utf8'));
    } catch (_) {}
    res.render('index', { orders });
});

// Xử lý cập nhật trạng thái đơn hàng
router.post('/orders/:orderId/complete', async (req, res) => {
    const orderId = req.params.orderId;
    const newStatus = 'OrderDelivered';

    try {
        await sendUpdateOrderStatusRequest(orderId, newStatus);
        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (err) {
        console.error('❌ Lỗi cập nhật:', err);
        res.status(err.response?.status || 500).json({
            message: 'Lỗi cập nhật trạng thái',
            error: err.response?.data || {}
        });
    }
});

module.exports = router;
