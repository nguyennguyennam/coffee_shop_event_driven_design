// ProductCategories.tsx
import React from 'react';
import { Fade, Zoom, Card, CardContent, Typography, Box } from '@mui/material';
import '../../assets/styles/components/productCategories.css'; // Import your CSS styles

interface Category {
  name: string;
  icon: string;
  bgcolor: string;
  textColor: string;
}

const ProductCategories: React.FC = () => {
  const categories: Category[] = [
    {
      name: 'Coffee',
      icon: '☕',
      bgcolor: 'linear-gradient(135deg, #FFF8DC 0%, #F4E4BC 100%)',
      textColor: '#8B4513',
    },
    {
      name: 'Tea',
      icon: '🍵',
      bgcolor: 'linear-gradient(135deg, #F0FFF0 0%, #E6F3E6 100%)',
      textColor: '#228B22',
    },
    {
      name: 'MilkTea',
      icon: '🧋',
      bgcolor: 'linear-gradient(135deg, #F8F0FF 0%, #E6D7FF 100%)',
      textColor: '#8A2BE2',
    },
    {
      name: 'Cream',
      icon: '🍰',
      bgcolor: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%)',
      textColor: '#DC143C',
    },
  ];

  return (
    <Box className="product-categories">

      {/* Category Cards */}
      <Box className="category-list">
        {categories.map((category, index) => (
          <Zoom in timeout={1000 + index * 200} key={index}>
            <Card
              className="category-card"
              style={{ background: category.bgcolor }}
            >
                <CardContent
                className="card-content"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                <div className="category-icon">{category.icon}</div>
                <Typography
                  className="category-name"
                  style={{ color: category.textColor, fontSize: '1.5rem', fontWeight: 'bold' }}
                >
                  {category.name}
                </Typography>
                </CardContent>
            </Card>
          </Zoom>
        ))}
      </Box>

      {/* Dots */}
      <Fade in timeout={2000}>
        <Box className="decorative-dots">
          <div className="dot" style={{ backgroundColor: '#FFA500', animationDelay: '0s' }} />
          <div className="dot" style={{ backgroundColor: '#228B22', animationDelay: '0.2s' }} />
          <div className="dot" style={{ backgroundColor: '#8A2BE2', animationDelay: '0.4s' }} />
          <div className="dot" style={{ backgroundColor: '#DC143C', animationDelay: '0.6s' }} />
        </Box>
      </Fade>
    </Box>
  );
};

export default ProductCategories;
