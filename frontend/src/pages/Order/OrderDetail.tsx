import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Divider, Stack, Button } from '@mui/material';
import axios from 'axios';
import type { OrderDetail, Order } from '../../types'; // Use type-only import
import type { Payment } from '../../types/payment'; // Use type-only import

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    if (id) {
        // Fetch both order and payment concurrently
        Promise.all([
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/order/${id}`),
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/payment/order/${id}`)
        ])
        .then(([orderResponse, paymentResponse]) => {
            setOrder(orderResponse.data);
            setPayment(paymentResponse.data);
            console.log("Order data:", orderResponse.data);
            console.log("Payment data:", paymentResponse.data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Failed to fetch order or payment:", error);
            setLoading(false);
        });
    }
}, [id]);

  const handleConfirm = () => {
    if (order?.status === 'Order Delivered') {
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/api/order/${order.id}/confirm`)
        .then(response => {
          console.log("Order confirmed:", response.data);
          setOrder(response.data);
        })
        .catch(error => {
          console.error("Failed to confirm order:", error);
        });
    }
  };

  if (loading) {
    return <Typography align="center" sx={{ mt: 4 }}>Loading...</Typography>;
  }
  if (!order) {
    return <Typography align="center" sx={{ mt: 4 }}>Order not found</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Chi tiết đơn hàng
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {/* Order Information */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Thông tin đơn hàng:</Typography>
          <Typography><strong>Mã đơn hàng:</strong> {order.id}</Typography>
          <Typography><strong>Trạng thái:</strong> {order.status}</Typography>
          <Typography><strong>Khách hàng:</strong> {order.customerId}</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        {/* Timeline of order phases */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Quá trình xử lý đơn hàng:</Typography>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="subtitle1" color="text.secondary"><strong>Đặt hàng:</strong></Typography>
              <Typography>{new Date(order.orderDate || '').toLocaleString('vi-VN')}</Typography>
            </Box>
            {payment && (
              <Box>
                <Typography variant="subtitle1" color="text.secondary"><strong>Thanh toán:</strong></Typography>
                <Typography>{new Date(payment.createdAt).toLocaleString('vi-VN')}</Typography>
              </Box>
            )}
          </Stack>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        {/* Order items */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Sản phẩm trong đơn hàng:</Typography>
          {order.orderItems.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography>{item.drinkName} x {item.quantity}</Typography>
            </Box>
          ))}
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        {/* Payment Information */}
        {payment && (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">Thông tin thanh toán:</Typography>
              <Typography><strong>Trạng thái thanh toán:</strong> {payment.status}</Typography>
              <Typography><strong>Mã giao dịch:</strong> {payment.transactionId}</Typography>
              <Typography>
                <strong>Số tiền thanh toán:</strong> {payment.amount.toLocaleString('vi-VN')}đ
              </Typography>
              <Typography>
                <strong>Thời gian thanh toán:</strong> {new Date(payment.createdAt).toLocaleString('vi-VN')}
              </Typography>
              {payment.processedAt && (
                <Typography>
                  <strong>Thời gian xử lý:</strong> {new Date(payment.processedAt).toLocaleString('vi-VN')}
                </Typography>
              )}
            </Box>
            <Divider sx={{ mb: 2 }} />
          </>
        )}


        {/* Total Price */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Tổng tiền:</Typography>
          <Typography variant="h6">{order.totalPrice.toLocaleString('vi-VN')}đ</Typography>
        </Box>

        {/* Confirm Receipt Button for delivered orders */}
        {order.status === 'Order Delivered' && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleConfirm}>
              Xác nhận nhận hàng
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

