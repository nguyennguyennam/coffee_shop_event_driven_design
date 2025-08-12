// ProductCategories.tsx
import React from 'react';
import { Fade, Zoom, Card, CardContent, Typography, Box } from '@mui/material';
import '../../assets/styles/pages/productCategories.css';

interface Category {
    name: string;
    icon: string;
    bgcolor: string;
    textColor: string;
    value: string;
}

interface ProductCategoriesProps {
    onCategoryClick: (category: string) => void;
    selectedCategory: string;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({ onCategoryClick, selectedCategory }) => {
    const categories: Category[] = [
        {
            name: 'Coffee',
            icon: '☕',
            bgcolor: 'linear-gradient(135deg, #FFF8DC 0%, #F4E4BC 100%)',
            textColor: '#8B4513',
            value: 'coffee'
        },
        {
            name: 'Tea',
            icon: '🍵',
            bgcolor: 'linear-gradient(135deg, #F0FFF0 0%, #E6F3E6 100%)',
            textColor: '#228B22',
            value: 'tea'
        },
        {
            name: 'MilkTea',
            icon: '🧋',
            bgcolor: 'linear-gradient(135deg, #F8F0FF 0%, #E6D7FF 100%)',
            textColor: '#8A2BE2',
            value: 'milktea'
        },
        {
            name: 'Cream',
            icon: '🍰',
            bgcolor: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%)',
            textColor: '#DC143C',
            value: 'cream'
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
                            style={{ 
                                background: category.bgcolor,
                                border: selectedCategory === category.value ? `3px solid ${category.textColor}` : 'none'
                            }}
                            onClick={() => onCategoryClick(category.value)}
                        >
                            <CardContent
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            >
                                <div className="category-icon">{category.icon}</div>
                                <Typography
                                    className="category-name"
                                    style={{ color: category.textColor, fontWeight: 'bold' }}
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