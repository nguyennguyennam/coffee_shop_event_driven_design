// src/pages/CheckoutPage.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Order } from '../../types';
import { Box, Typography, Paper } from '@mui/material';

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return; // Không fetch nếu không có id
    const fetchOrder = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/order/${id}`);
      const data = await res.json();
      setOrder(data);
    };
    fetchOrder();
  }, [id]);

  if (!id) return <Typography align="center" color="error">Không tìm thấy mã đơn hàng.</Typography>;
  if (!order) return <Typography align="center">Loading...</Typography>;

  // Tính lại giá gốc nếu totalPrice đã là giá sau giảm
  const voucher = (order as any).voucher || (order as any).Voucher;
  const discount =
    voucher && voucher.discountAmount && typeof voucher.discountAmount.amount === "number"
      ? voucher.discountAmount.amount
      : 0;
  // Giá gốc = totalPrice + discount (nếu totalPrice đã là giá sau giảm)
  const originalTotal =
    typeof order.totalPrice === "number"
      ? order.totalPrice + discount
      : 0;
  const totalAfterDiscount =
    typeof order.totalPrice === "number"
      ? order.totalPrice
      : 0;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Thông tin đơn hàng
        </Typography>
        <Typography>
          <strong>Mã đơn hàng:</strong> {order.id}
        </Typography>
        <Typography>
          <strong>Khách hàng:</strong> {order.customerId}
        </Typography>
        <Typography>
          <strong>Trạng thái:</strong> {order.status || "Chờ xử lý"}
        </Typography>
      
        <Typography sx={{ mt: 2, mb: 1 }} variant="h6">
          Danh sách sản phẩm:
        </Typography>
        <ul>
          {(order.orderItems ?? []).map(item => (
            <li key={item.drinkId}>
              {item.drinkName} - SL: {item.quantity}
            </li>
          ))}
        </ul>
        <Typography sx={{ mt: 2 }}>
          <strong>Tổng tiền:</strong> {(typeof order.totalPrice === "number" ? order.totalPrice : 0).toLocaleString("vi-VN")}đ
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Giá gốc:</strong> {originalTotal.toLocaleString("vi-VN")}đ
        </Typography>
        {voucher && voucher.code && (
          <Typography>
            <strong>Voucher áp dụng:</strong> {voucher.code}
          </Typography>
        )}
        {discount > 0 && (
          <Typography color="green">
            <strong>Giảm giá:</strong> -{discount.toLocaleString("vi-VN")}đ
          </Typography>
        )}
        <Typography sx={{ mt: 1, fontWeight: "bold" }}>
          <strong>Thành tiền:</strong> {totalAfterDiscount.toLocaleString("vi-VN")}đ
        </Typography>
      </Paper>
    </Box>
  );
}
