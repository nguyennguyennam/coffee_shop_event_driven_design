import React from 'react';
import HeroSection from './HeroSection';
import ProductCategories from './ProductCategories';
import '../../assets/styles/pages/home.css'; // Import your CSS styles

const MainContent: React.FC = () => {
  return (
    <div className="app-container">
      {/* Hero Section */}
      
      <HeroSection />
    
      
      {/* Product Categories */}
      
      <ProductCategories />
      
    </div>
  );
};

export default MainContent;

