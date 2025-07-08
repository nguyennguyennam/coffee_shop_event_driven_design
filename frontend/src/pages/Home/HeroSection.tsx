import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Fade,
  Zoom,
} from '@mui/material';
import '../../assets/styles/pages/heroSection.css'; // Import your CSS styles



const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="hero-section">
      <Fade in timeout={1000}>
        
          <div className="hero-content">
            <h1>Chào mừng đến với</h1> 
            <h1 className="gradient-text">Rise of Coffee</h1>
            <Fade in timeout={1500}>
            <p>Thưởng thức hương vị cà phê tinh tế trong không gian ấm áp</p>
            </Fade>
            <Zoom in timeout={2000}>
                  <button
                    onClick={() => navigate(`/products`)}
                    className="btn-product"
                  >
                    Khám phá Menu
                  </button>
            </Zoom>
          </div>
      </Fade>
    </div>

  );
};

export default HeroSection;

