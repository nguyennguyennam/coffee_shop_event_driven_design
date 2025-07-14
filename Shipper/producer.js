const axios = require('axios');

const DOTNET_API_BASE_URL = 'http://localhost:5079/api';

async function sendUpdateOrderStatusRequest(orderId, NewStatus) {
    try {
        console.log(`🌐 Gửi yêu cầu cập nhật trạng thái Order: ${orderId} thành '${NewStatus}' tới .NET Backend`);
        const response = await axios.post(`${DOTNET_API_BASE_URL}/Order/${orderId}/status`, {
            newStatus: NewStatus
        });
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

module.exports = { sendUpdateOrderStatusRequest };