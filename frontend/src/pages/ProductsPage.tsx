import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import { Drink } from '../types';
import '../assets/styles/pages/products.css';


const ProductsPage: React.FC = () => {
  // New state: fetched drinks
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch drinks from backend (from DrinksController GET endpoint)
  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await fetch('http://localhost:5079/api/drinks');
        const data = await response.json();
        // Lưu dữ liệu vào state drinks
        setDrinks(data);
      } catch (error) {
        console.error('Error fetching drinks:', error);
      }
    };
    fetchDrinks();
  }, []);

  // Category options
  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'tea', label: 'Tea' },
    { value: 'milktea', label: 'Milk Tea' },
    { value: 'cream', label: 'Cream' },
  ];

  // Filter drinks based on selected category and search term
  const filteredDrinks = drinks.filter(drink => {
    const matchesCategory = selectedCategory === 'all' || drink.type === selectedCategory;
    const matchesSearch = (drink.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle buy operations
  const handleBuy = (id: string) => {
    console.log('Buying drink with id:', id);
    // ...additional buy logic...
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <h1 className="page-title">Sản phẩm của chúng tôi</h1>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
            }}
            style={{ textAlign: 'center' }}
          >
            Khám phá bộ sưu tập đồ uống của chúng tôi
          </Typography>
        </Box>

        {/* Product Search */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Product Categories */}
        <Tabs
          value={selectedCategory}
          onChange={(event, newValue) => setSelectedCategory(newValue)}
          sx={{ mb: 4 }}
        >
          {categories.map(category => (
            <Tab key={category.value} label={category.label} value={category.value} />
          ))}
        </Tabs>

        {/* Product Grid */}
        <Grid className="products-grid">
          {filteredDrinks.map(drink => (
            <div key={drink.id} style={{ margin: '16px' }}>
              <ProductCard
                drink={drink}
                onBuy={handleBuy}
              />
            </div>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductsPage;