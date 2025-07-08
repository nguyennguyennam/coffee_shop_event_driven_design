import React from 'react';
import HeroSection from './HeroSection';
import ProductCategories from './ProductCategories';
import '../../assets/styles/pages/home.css'; // Import your CSS styles

const MainContent: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px'}}>
      {/* Hero Section */}
      <div style={{ flex: 4 }}>
      <HeroSection />
      </div>
      
      {/* Product Categories */}
      <div style={{ flex: 1 }}>
      <ProductCategories />
      </div>
    </div>
  );
};

export default MainContent;

