import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Sidebar from './pages/Sidebar';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import ProductsPage from './pages/Product/ProductsPage';
import ProductDetail from './pages/Product/ProductDetail';
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Cart/CheckoutPage';
import LoginPage from './pages/LoginPage';
import PaymentResultPage from './pages/PaymentResultPage';
import './App.css';
import ProfilePage from './pages/ProfilePage';
import OrderPage from './pages/Order/OrderPage';
import OrderDetail from './pages/Order/OrderDetail'; // Import OrderDetail component
import OrderNotification from './pages/Order/OrderNotification';

// Tạo theme tùy chỉnh cho Coffee Shop
const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513', // Màu nâu coffee
      light: '#D2691E',
      dark: '#654321',
    },
    secondary: {
      main: '#FFA500', // Màu cam
      light: '#FFD700',
      dark: '#FF8C00',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />

          {/* Main content area with routes */}
          <Box component="main" sx={{ flex: 1, padding: 3 }}>
            {/* <CustomerNotification /> */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout/:orderId" element={<CheckoutPage />} />
              <Route path="payment-result" element={<PaymentResultPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="orders" element={<OrderPage />} />
              <Route path="order/:id" element={<OrderDetail />} />
              <Route path="order-notification" element={<OrderNotification />} />
            </Routes>
          </Box>
        </Box>
    </ThemeProvider>
  );
};

export default App;