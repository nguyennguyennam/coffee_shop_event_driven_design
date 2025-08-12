// ProductWithCategories.tsx
import React from 'react';
import { Box, Typography, Tabs, Tab, Divider } from '@mui/material';
import ProductCard from '../Product/ProductCard';
import { Drink } from '../../types';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/pages/productCategories.css';

interface ProductWithCategoriesProps {
    drinks: Drink[];
    selectedCategory: string;
}

function ProductWithCategories({ drinks, selectedCategory }: ProductWithCategoriesProps) {
    const navigate = useNavigate();

    // Filter drinks based on selected category
    const filteredDrinks = selectedCategory === 'all' 
        ? drinks.slice(0, 4) 
        : drinks.filter(drink => drink.type === selectedCategory).slice(0, 4);

    const handleBuy = (id: string) => {
        console.log('Mua sản phẩm có ID:', id);
    };

    return (
        <Box sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 2,
            boxShadow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            <Box>
                
                <Box sx={{  display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }} className="list-product-hot">
                    {filteredDrinks.map((drink) => (
                        <Box 
                            className="product-hot"
                            key={drink.id} 
                            sx={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/product/${drink.id}`)}
                        >
                            <ProductCard 
                                drink={drink} 
                                onBuy={handleBuy}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default ProductWithCategories;