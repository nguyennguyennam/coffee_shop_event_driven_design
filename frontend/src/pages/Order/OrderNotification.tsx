import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { sendCustomerConfirmOrder } from '../../services/customerApi';

interface OrderDeliveredEvent {
  orderId: string;
}

const SOCKET_URL = 'http://localhost:3001'; // Địa chỉ Socket.IO server (Shipper service)

const socket: Socket = io(SOCKET_URL, {
  transports: ['websocket'], // Bắt buộc nếu bạn dùng CORS hoặc proxy
});

export default function OrderNotification() {
  const [deliveredOrders, setDeliveredOrders] = useState<string[]>([]);

  useEffect(() => {
    const handleOrderDelivered = (data: OrderDeliveredEvent) => {
      console.log('📬 Nhận event orderDeliveredUI:', data);
      setDeliveredOrders((prev) => [...prev, data.orderId]);
    };

    socket.on('orderDeliveredUI', handleOrderDelivered);

    return () => {
      socket.off('orderDeliveredUI', handleOrderDelivered);
    };
  }, []);

  const handleConfirm = async (orderId: string) => {
    try {
      await sendCustomerConfirmOrder(orderId);
      alert(`✅ Đã xác nhận nhận hàng: ${orderId}`);
      setDeliveredOrders((prev) => prev.filter((id) => id !== orderId));
    } catch (err: any) {
      alert(`❌ Lỗi khi xác nhận: ${err.message}`);
    }
  };

  if (deliveredOrders.length === 0) return null;

  return (
    <div className="notification-container">
      {deliveredOrders.map((orderId) => (
        <div key={orderId} className="notification">
          <p>📦 Đơn hàng <strong>{orderId}</strong> đã được giao.</p>
          <button onClick={() => handleConfirm(orderId)}>Tôi đã nhận hàng</button>
        </div>
      ))}
    </div>
  );
}
