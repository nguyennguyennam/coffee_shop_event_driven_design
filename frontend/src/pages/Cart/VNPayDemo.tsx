import { useState } from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

const VNPayDemo = () => {
    const [orderData, setOrderData] = useState({
        orderId: `ORDER_${Date.now()}`,
        amount: 100000,
        orderInfo: 'Thanh toán đơn hàng Coffee Shop'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: orderData.orderId,
                    amount: orderData.amount,
                    returnUrl: `${process.env.REACT_APP_API_BASE_URL}/api/Payment/vnpay-return`
                })
            });

            if (!response.ok) throw new Error('Không thể tạo yêu cầu thanh toán');

            const data = await response.json();

            window.location.href = data.paymentUrl || data.PaymentUrl;
        } catch (err: any) {
            setError(err.message || 'Có lỗi khi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <CardHeader>
                <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCard style={{ fontSize: 20 }} />
                    VNPay Demo
                </Typography>
            </CardHeader>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    id="orderId"
                    label="Mã đơn hàng"
                    variant="outlined"
                    value={orderData.orderId}
                    onChange={(e) => setOrderData({ ...orderData, orderId: e.target.value })}
                    fullWidth
                />
                <TextField
                    id="amount"
                    type="number"
                    label="Số tiền (VNĐ)"
                    variant="outlined"
                    value={orderData.amount}
                    onChange={(e) => setOrderData({ ...orderData, amount: parseInt(e.target.value) || 0 })}
                    fullWidth
                />
                <TextField
                    id="orderInfo"
                    label="Thông tin đơn hàng"
                    variant="outlined"
                    value={orderData.orderInfo}
                    onChange={(e) => setOrderData({ ...orderData, orderInfo: e.target.value })}
                    fullWidth
                />

                {error && <Alert severity="error">{error}</Alert>}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePayment}
                    disabled={loading || !orderData.orderId || orderData.amount <= 0}
                    fullWidth
                    sx={{ mt: 1 }}
                >
                    {loading ? (
                        <>
                            <Loader2 style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
                            Đang kết nối...
                        </>
                    ) : (
                        'Thanh toán với VNPay'
                    )}
                </Button>
            </CardContent>
        </Card>
    );
};


export default VNPayDemo;
