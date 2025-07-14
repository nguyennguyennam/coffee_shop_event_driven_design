import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get('status') || '';
  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');
  const message = searchParams.get('message');

  const isSuccess = status.toLowerCase() === 'success';
  const title = isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại';
  const description = isSuccess
    ? `Đơn hàng ${orderId} đã được thanh toán. Mã giao dịch: ${transactionId}`
    : `Thanh toán không thành công. ${message || ''}`;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, textAlign: 'center' }}>
      <Typography variant="h4" color={isSuccess ? 'green' : 'error'} gutterBottom>
        {title}
      </Typography>
      <Typography sx={{ mb: 3 }}>
        {description}
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Quay về trang chủ
      </Button>
    </Box>
  );
}
