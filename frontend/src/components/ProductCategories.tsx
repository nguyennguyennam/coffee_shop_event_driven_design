import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Fade,
  Zoom,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Animation keyframes
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

// Styled components
const CategoryCard = styled(Card)<{ bgcolor: string }>(({ theme, bgcolor }) => ({
  background: bgcolor,
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: (theme.shape.borderRadius as number) * 2,
  height: '100%',
  '&:hover': {
    transform: 'scale(1.1) rotate(3deg)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
  },
}));

const CategoryIcon = styled(Box)(() => ({
  fontSize: '3rem',
  marginBottom: '0.5rem',
  transition: 'transform 0.3s ease',
  '.MuiCard-root:hover &': {
    transform: 'scale(1.25)',
  },
}));

const DecorativeDot = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  animation: `${pulse} 2s ease-in-out ${delay}s infinite`,
}));

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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Fade in timeout={800}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 1,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
            }}
          >
            Sản phẩm mới
          </Typography>
          <Box
            sx={{
              width: 60,
              height: 4,
              background: 'linear-gradient(90deg, #FFA500, #FF8C00)',
              borderRadius: 2,
            }}
          />
        </Box>
      </Fade>

      {/* Categories Grid */}
      <Box sx={{ flex: 1 }}>
        <Grid container spacing={2}>
          {categories.map((category, index) => (
            <div
              key={index}
              style={{ width: '50%', padding: 8, boxSizing: 'border-box' }}
            >
              <Zoom in timeout={1000 + index * 200}>
                <CategoryCard bgcolor={category.bgcolor}>
                  <CardContent
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      '&:last-child': { pb: 3 },
                    }}
                  >
                    <CategoryIcon>{category.icon}</CategoryIcon>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: category.textColor,
                        fontSize: { xs: '1rem', md: '1.2rem' },
                        transition: 'transform 0.3s ease',
                        '.MuiCard-root:hover &': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      {category.name}
                    </Typography>
                  </CardContent>
                </CategoryCard>
              </Zoom>
            </div>
          ))}
        </Grid>
      </Box>

      {/* Decorative dots */}
      <Fade in timeout={2000}>
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <DecorativeDot sx={{ bgcolor: '#FFA500' }} delay={0} />
          <DecorativeDot sx={{ bgcolor: '#228B22' }} delay={0.2} />
          <DecorativeDot sx={{ bgcolor: '#8A2BE2' }} delay={0.4} />
          <DecorativeDot sx={{ bgcolor: '#DC143C' }} delay={0.6} />
        </Box>
      </Fade>
    </Box>
  );
};

export default ProductCategories;

