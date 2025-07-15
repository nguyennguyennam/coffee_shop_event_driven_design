import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, CardMedia, Typography, Button, Stack } from '@mui/material';

export default function ProfilePage() {
  const navigate = useNavigate();
  
  // Lấy thông tin user từ cookie
  const userCookie = Cookies.get('user');
  const user = userCookie ? JSON.parse(userCookie) : null;
  
  const handleLogout = () => {
    Cookies.remove('user'); // Xóa cả user và token
    navigate('/login');
  };
  
  const handleViewOrders = () => {
    navigate('/orders');
  };

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">Bạn chưa đăng nhập!</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/login')}>
          Đến trang đăng nhập
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <div>
        <div className="avatar" style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
          <img 
            src="https://img.freepik.com/premium-vector/cartoon-coffee-cup-with-glasses_811482-178.jpg" 
            alt="Avatar" 
            style={{ width: '100%', maxWidth: 120, borderRadius: '50%' }} 
          />
        </div>
        <Card sx={{ boxShadow: 3, borderRadius: 2, marginTop: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>ID:</strong> {user.id}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <strong>Email:</strong> {user.email}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleViewOrders}>
              Xem đơn hàng
            </Button>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Đăng Xuất
            </Button>
          </Stack>
        </CardContent>
        </Card>
      </div>
    </Box>
  );
}