// src/components/ProductCard.tsx

import React from 'react';
import { Drink } from '../../types';
import '../../assets/styles/pages/products.css'; // Import your CSS styles

interface Props {
  drink: Drink;
  onBuy: (id: string) => void;
}

export default function ProductCard({ drink, onBuy }: Props) {
  // Conversion rate: 1 USD = 23,000 VND (adjust as necessary)
  // Use Math.floor to remove any decimal digits.
  const conversionRate = 23000;
  const priceVND = Math.floor(drink.price * conversionRate);

  return (
    <div className="product-card">
      <img src={drink.image} alt={drink.name} className="product-image" />
      <div className="product-info">
        <div className="product-name">{drink.name}</div>
        <p className="product-price">
          Giá: {priceVND.toLocaleString('vi-VN')} VND
        </p>
      </div>
    </div>
  );
}
