import axios from 'axios';

const DOTNET_API_BASE_URL = 'http://localhost:5079/api';

interface UpdateStatusResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export async function sendCustomerConfirmOrder(orderId: string): Promise<UpdateStatusResponse> {
  try {
    console.log(`📦 Gửi xác nhận khách hàng đã nhận đơn hàng: ${orderId}`);

    const response = await axios.post(`${DOTNET_API_BASE_URL}/Order/${orderId}/status`, {
      newStatus: 'Order Confirmed',
    });

    console.log('✅ Phản hồi từ backend:', response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('❌ Lỗi khi xác nhận đơn hàng:', error.message || error);

    if (error.response) {
      console.error('↪ Response data:', error.response.data);
      console.error('↪ Response status:', error.response.status);
    }

    return {
      success: false,
      message: error.message || 'Unknown error',
    };
  }
}
