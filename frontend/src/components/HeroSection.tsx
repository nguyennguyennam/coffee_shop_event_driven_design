import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Fade,
  Zoom,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Animation keyframes
const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

// Styled components
const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '100vh',
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2061&q=80')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
}));

const FloatingIcon = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
  position: 'absolute',
  fontSize: '2rem',
  animation: `${bounce} 2s ease-in-out ${delay}s infinite`,
  userSelect: 'none',
}));

const GradientText = styled('span')(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}));

const HeroSection: React.FC = () => {
  return (
    <HeroContainer>
      {/* Animated overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.2), transparent)',
          animation: `${float} 4s ease-in-out infinite`,
        }}
      />

      {/* Main content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Zoom in timeout={1200}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                  fontWeight: 800,
                  mb: 3,
                  lineHeight: 1.2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                Chào mừng đến với{' '}
                <GradientText>Rise of Coffee</GradientText>
              </Typography>
            </Zoom>

            <Fade in timeout={1500}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.2rem', md: '1.5rem', lg: '1.8rem' },
                  mb: 4,
                  color: 'rgba(255,255,255,0.9)',
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                Thưởng thức hương vị cà phê tinh tế trong không gian ấm áp
              </Typography>
            </Fade>

            <Zoom in timeout={2000}>
              <Button
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
      </Container>

      {/* Floating coffee icons */}
      <FloatingIcon sx={{ top: 80, left: 40 }} delay={1}>
        ☕
      </FloatingIcon>
      <FloatingIcon sx={{ bottom: 120, right: 60 }} delay={2}>
        🫘
      </FloatingIcon>
      <FloatingIcon sx={{ top: '33%', right: 30 }} delay={0.5}>
        ☕
      </FloatingIcon>
    </HeroContainer>
  );
};

export default HeroSection;

