import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import ProductCard from './ProductCard';
import { Drink } from '../../types';
import '../../assets/styles/pages/products.css';
import { useNavigate } from 'react-router-dom';

const ProductsPage: React.FC = () => {
  // New state: fetched drinks
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  // Fetch drinks from backend (from DrinksController GET endpoint)
  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/drinks`);
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
    <div>
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
            <Tab 
              key={category.value} 
              label={category.label} 
              value={category.value} 
              sx={{ fontSize: '1.15rem', mx: 2 }} // added horizontal margin for wider spacing
            />
          ))}
        </Tabs>

        {/* Product Grid */}
        <div className="products-grid">
          {filteredDrinks.map(drink => (
            // Wrap each product card with onClick to navigate
            <div 
              key={drink.id} 
              style={{ margin: '16px'}}
              onClick={() => navigate(`/product/${drink.id}`)}
            >
              <ProductCard drink={drink} onBuy={handleBuy} />
            </div>
          ))}
        </div>
    </div>
  );
};

export default ProductsPage;