// src/components/ProductCard.tsx

import React from 'react';
import { Drink } from '../../types';
import '../../assets/styles/components/productCard.css'; // Import your CSS styles

interface Props {
  drink: Drink;
  onBuy: (id: string) => void;
}

export default function ProductCard({ drink, onBuy }: Props) {
  return (
    <div className="product-card">
      <img src={drink.image} alt={drink.name} className="product-image" />
      <div className="product-info">
          <h2 className="product-name">{drink.name}</h2>
            <p className="product-price">Giá: ${parseFloat(drink.price.toFixed(4))}</p>
        </div>
      </div>
  );
}
