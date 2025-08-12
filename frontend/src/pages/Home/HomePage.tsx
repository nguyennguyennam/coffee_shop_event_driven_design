// MainContent.tsx
import React, { useState, useEffect } from 'react';
import { Drink } from '../../types';
import HeroSection from './HeroSection';
import ProductCategories from './ProductCategories';
import ProductWithCategories from './ProductWithCategories';
import '../../assets/styles/pages/home.css';

const MainContent: React.FC = () => {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        const fetchDrinks = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/drinks`);
                const data = await response.json();
                setDrinks(data);
            } catch (error) {
                console.error('Error fetching drinks:', error);
            }
        };
        fetchDrinks();
    }, []);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px'}}>
            {/* Hero Section */}
            <div style={{ flex: 6 }}>
                <HeroSection />
            </div>
            
            {/* Product Categories */}
            <div style={{ display: 'flex', flex: 4, flexDirection: 'column', gap: '20px', overflowX: 'hidden' }}>
                <ProductCategories 
                    onCategoryClick={handleCategoryClick} 
                    selectedCategory={selectedCategory}
                />
                <ProductWithCategories 
                    drinks={drinks} 
                    selectedCategory={selectedCategory}
                />
            </div>
        </div>
    );
};

export default MainContent;