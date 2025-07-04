import React from 'react';
import { Box } from '@mui/material';
import HeroSection from './HeroSection';
import ProductCategories from './ProductCategories';

const MainContent: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flex: 1 }}>
      {/* Hero Section */}
      {/* <Box sx={{ flex: 1 }}>
        <HeroSection />
      </Box> */}
      
      {/* Product Categories */}
      <Box
        sx={{
          width: { xs: '100%', lg: 320 },
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        <ProductCategories />
      </Box>
    </Box>
  );
};

export default MainContent;

