// src/components/ProductCard.tsx

import React from 'react';
import { Drink } from '../../types';
import '../../assets/styles/pages/products.css'; // Import your CSS styles

interface Props {
  drink: Drink;
  onBuy: (id: string) => void;
}

export default function ProductCard({ drink, onBuy }: Props) {
  return (
    <div className="product-card">
      <img src={drink.image} alt={drink.name} className="product-image" />
      <div className="product-info">
          <div className="product-name">{drink.name}</div>
          <p className="product-price">Giá: ${parseFloat(drink.price.toFixed(4))}</p>
        </div>
      </div>
  );
}
