import React, { useState } from 'react';
import { Button, CircularProgress, Alert } from '@mui/material';
import { paymentApiService } from '../services/paymentApi';
import Cookies from 'js-cookie';

interface PaymentButtonProps {
  orderId: string;
  amount: number;
  disabled?: boolean;
  onPaymentInitiated?: () => void;
  onError?: (error: string) => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  orderId,
  amount,
  disabled = false,
  onPaymentInitiated,
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      const userCookie = Cookies.get('user');
      const user = userCookie ? JSON.parse(userCookie) : null;
  
      const returnUrl = `${process.env.REACT_APP_API_BASE_URL}/api/Payment/vnpay-return`;
      
      const response = await paymentApiService.createPayment({
        orderId,
        amount,
        returnUrl,
        userId: user ? user.id : null
      });

      // Redirect to VNPay payment page
      window.location.href = response.paymentUrl;
      
      if (onPaymentInitiated) {
        onPaymentInitiated();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo thanh toán';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        onClick={handlePayment}
        disabled={disabled || loading}
        sx={{
          py: 2,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
          }
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
            Đang xử lý...
          </>
        ) : (
          'Thanh toán với VNPay'
        )}
      </Button>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </div>
  );
};
