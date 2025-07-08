import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Drink, OrderItem } from '../../types';
import '../../assets/styles/pages/products.css';
import '../../assets/styles/pages/cart.css';
import '../../assets/styles/components/button.css'; // Import your CSS styles
import Button from '../../components/Button'; // Import your CSS styles
import Cookies from 'js-cookie';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [drink, setDrink] = useState<Drink | null>(null);
  const [quantity, setQuantity] = useState(1); // 👈 Số lượng được chọn
  const navigate = useNavigate();

  // Lấy userId từ localStorage (nếu cần dùng)
  const userCookie = Cookies.get('user');
  const user = userCookie ? JSON.parse(userCookie) : null;
  const userId = user ? user.id : null;
  useEffect(() => {
    const fetchDrink = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/drinks/${id}`);
        if (!response.ok) throw new Error('Drink not found');
        const data = await response.json();
        setDrink(data);
      } catch (error) {
        console.error('Error fetching drink:', error);
      }
    };
    fetchDrink();
  }, [id]);

  if (!drink) {
    return (
      <Container maxWidth={false}>
        <Typography variant="h5" align="center">Loading...</Typography>
      </Container>
    );
  }

  // Add to cart với số lượng đã chọn, lưu vào localStorage
  const addToCart = () => {
    if (!userId) {
      navigate('/login');
      return;
    }
    const cartStr = localStorage.getItem('cart');
    let cart: OrderItem[] = [];
    if (cartStr) {
      try {
        cart = JSON.parse(cartStr);
      } catch {
        cart = [];
      }
    }
    const existing = cart.find((item) => item.drinkId === drink.id);
    if (existing) {
      cart = cart.map((item) =>
        item.drinkId === drink.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      cart.push({
        id: userId || '1',
        drinkId: drink.id,
        price: drink.price,
        quantity: quantity,
        drinkName: drink.name || '',
        image: drink.image
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setQuantity(1); // Reset sau khi thêm
    alert('Sản phẩm đã được thêm vào giỏ hàng thành công');
  };

  return (
    <Container maxWidth={false}>
      <Button
        onClick={() => navigate(-1)}
        label='btn-back'
        name='Back'
      />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
        }}
      >
        <Box
          sx={{
        width: { xs: '100%', md: '50%' },
        borderRadius: 2,
          }}
        >
          <Box
        component="img"
        src={drink.image}
        alt={drink.name}
        sx={{
          width: '100%',
          height: 'auto', // Remove fixed height
          borderRadius: 2,
          objectFit: 'cover', // Ensures the image covers the area without stretching
        }}
          />
        </Box>
        {(() => {
          return (
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" gutterBottom>
                {drink.name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Type: {drink.type} | Size: {drink.size}
              </Typography>
              <Typography variant="body1" paragraph>
                {drink.description}
              </Typography>
              <Typography variant="h5" color="secondary" gutterBottom>
                Price: ${drink.price.toLocaleString('vi-VN')}
              </Typography>

              {/* 👇 Điều chỉnh số lượng */}
              <div
                className="quantity-controls"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '16px 0',
                }}
              >
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <Typography variant="body1" sx={{ mx: 2 }}>
                  {quantity}
                </Typography>
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>

              <Button label="btn-card" name="Thêm vào giỏ" onClick={addToCart} />
            </Box>
          );
        })()}
      </Box>
    </Container>
  );
};

export default ProductDetail;

