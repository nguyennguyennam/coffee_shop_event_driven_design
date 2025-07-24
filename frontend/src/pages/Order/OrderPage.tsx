import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Box, Typography, List, ListItemButton, ListItemText, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Order } from '../../types/index'; // Assuming you have an Order type defined

export default function OrderPage() {
  const userCookie = Cookies.get('user');
  const user = userCookie ? JSON.parse(userCookie) : null;
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/order/customer/${user.id}`)
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  if (!user) {
    return <Typography variant="h6" align="center">Bạn chưa đăng nhập!</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Đơn hàng của tôi
      </Typography>
      <Paper sx={{ p: 2 }}>
        {orders.length === 0 ? (
          <Typography>Không có đơn hàng nào.</Typography>
        ) : (
          <List>
            {orders.map(order => (
              <ListItemButton
                key={order.id}
                onClick={() => navigate(`/order/${order.id}`)}
              >
                <ListItemText 
                  primary={`Mã đơn hàng: ${order.id}`} 
                  secondary={`Trạng thái: ${order.status}`} 
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
