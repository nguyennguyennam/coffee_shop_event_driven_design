import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';
import { Drink } from '../types';
import '../assets/styles/pages/products.css'; // or a dedicated styles file

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [drink, setDrink] = useState<Drink | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrink = async () => {
      try {
        const response = await fetch(`https://coffee-shop-1-qiwh.onrender.com/api/drinks/${id}`);
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
      <Container>
        <Typography variant="h5" align="center">
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box component="img" src={drink.image} alt={drink.name} sx={{ width: { xs: '100%', md: '50%' }, borderRadius: 2 }} />
        <Box>
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
          <Typography variant="h6" gutterBottom>
            Ingredients:
          </Typography>
          <ul>
            {drink.ingredient?.map(ing => (
              <li key={ing.id}>
                {ing.name} ({ing.quantity} {ing.unit})
              </li>
            ))}
          </ul>
          <Button variant="contained" sx={{ mt: 2 }}>
            Add to Cart
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetail;
