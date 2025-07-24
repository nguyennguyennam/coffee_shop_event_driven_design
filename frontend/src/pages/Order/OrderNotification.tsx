import React, { useEffect, useState, useRef } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { io, Socket } from 'socket.io-client';
import { sendCustomerConfirmOrder } from '../../services/customerApi';

interface OrderDeliveredEvent {
  orderId: string;
}

const SOCKET_URL = 'http://localhost:3006'; // Đảm bảo Shipper service đang lắng ở đây

export default function OrderNotification() {
  const [deliveredEvents, setDeliveredEvents] = useState<OrderDeliveredEvent[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Khởi tạo socket chỉ 1 lần
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnectionAttempts: 5,
        timeout: 5000
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Đã kết nối tới Socket.IO server:', socketRef.current?.id);
      });

      socketRef.current.on('disconnect', () => {
        console.warn('⚠️ Socket.IO đã ngắt kết nối');
      });

      socketRef.current.on('orderDeliveredUI', (data: OrderDeliveredEvent) => {
        console.log('📦 Nhận sự kiện orderDeliveredUI:', data);
        setDeliveredEvents(prev => [...prev, data]);
      });
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  const handleConfirm = async (orderId: string) => {
    try {
      await sendCustomerConfirmOrder(orderId); // Gửi API xác nhận lên .NET backend
      alert(`✅ Đã xác nhận nhận hàng: ${orderId}`);
      setDeliveredEvents(prev => prev.filter(e => e.orderId !== orderId));
    } catch (err: any) {
      alert(`❌ Lỗi khi xác nhận đơn hàng ${orderId}: ${err.message}`);
    }
  };

  if (deliveredEvents.length === 0) return null;

  return (
    <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}>
      {deliveredEvents.map(({ orderId }) => (
        <Paper key={orderId} elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Đơn hàng <strong>{orderId}</strong> đã được giao.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => handleConfirm(orderId)}>
            ✅ Tôi đã nhận hàng
          </Button>
        </Paper>
      ))}
    </Box>
  );
}
