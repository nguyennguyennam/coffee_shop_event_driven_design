import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Fade,
  Zoom,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import '../../assets/styles/pages/heroSection.css'; // Import your CSS styles



const HeroSection: React.FC = () => {
  return (
    <div className="main-content">
      <div>

        <div className="hero-section">
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', color: 'white' }}>
              <div className="hero-content">
                <h1>Chào mừng đến với</h1> 
                <h1 className="gradient-text">Rise of Coffee</h1>
                <Fade in timeout={1500}>
                <p>Thưởng thức hương vị cà phê tinh tế trong không gian ấm áp</p>
                </Fade>
              </div>

              

              <Zoom in timeout={2000}>
                  <Button
                  component={RouterLink}
                  to="/products"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'background.paper',
                    color: 'primary.main',
                    px: 4,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    borderRadius: 50,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                    bgcolor: 'background.paper',
                    transform: 'translateY(-4px) rotate(2deg)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                    },
                  }}
                  >
                  Khám phá Menu
                  </Button>
              </Zoom>
            </Box>
          </Fade>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

