import React, { useState } from 'react';
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
import { Product } from '../types';

const ProductsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Espresso Classico',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=300&h=200&fit=crop',
      category: 'coffee',
      rating: 4.8,
      description: 'Cà phê espresso đậm đà, hương vị cổ điển',
      isFavorite: false,
    },
    {
      id: 2,
      name: 'Cappuccino Deluxe',
      price: 55000,
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=200&fit=crop',
      category: 'coffee',
      rating: 4.9,
      description: 'Cappuccino với lớp foam mịn màng',
      isFavorite: true,
    },
    {
      id: 3,
      name: 'Green Tea Latte',
      price: 50000,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop',
      category: 'tea',
      rating: 4.6,
      description: 'Trà xanh latte thơm ngon, thanh mát',
      isFavorite: false,
    },
    {
      id: 4,
      name: 'Bubble Milk Tea',
      price: 60000,
      image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=300&h=200&fit=crop',
      category: 'milktea',
      rating: 4.7,
      description: 'Trà sữa trân châu đậm đà, ngọt ngào',
      isFavorite: false,
    },
    {
      id: 5,
      name: 'Tiramisu Cake',
      price: 75000,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop',
      category: 'cream',
      rating: 4.9,
      description: 'Bánh tiramisu kem mềm mịn',
      isFavorite: true,
    },
    {
      id: 6,
      name: 'Americano',
      price: 40000,
      image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=300&h=200&fit=crop',
      category: 'coffee',
      rating: 4.5,
      description: 'Cà phê americano nhẹ nhàng, dễ uống',
      isFavorite: false,
    },
  ]);

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'tea', label: 'Tea' },
    { value: 'milktea', label: 'Milk Tea' },
    { value: 'cream', label: 'Cream' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (productId: number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, isFavorite: !product.isFavorite }
        : product
    ));
  };

  const handleBuy = (productId: number) => {
    console.log('Add to cart:', productId);
    // ...your add-to-cart logic...
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 2,
              textAlign: 'center',
            }}
          >
            Sản phẩm của chúng tôi
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Khám phá bộ sưu tập đồ uống và bánh ngọt tuyệt vời của chúng tôi
          </Typography>
        </Box>

        {/* Search and Filter */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Tabs
            value={selectedCategory}
            onChange={(_, newValue) => setSelectedCategory(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
              },
            }}
          >
            {categories.map((category) => (
              <Tab
                key={category.value}
                label={category.label}
                value={category.value}
              />
            ))}
          </Tabs>
        </Box>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {filteredProducts.map(product => (
            <div key={product.id} style={{ width: '100%', marginBottom: '16px' }}>
              <ProductCard product={product} onBuy={handleBuy} />
            </div>
          ))}
        </Grid>

        {filteredProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Không tìm thấy sản phẩm nào phù hợp
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ProductsPage;
              