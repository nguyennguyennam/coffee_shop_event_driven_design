// src/components/ProductCard.tsx

import React from 'react';
import { Product } from '../types';
import '../assets/styles/components/productCard.css'; // Import your CSS styles

interface Props {
  product: Product;
  onBuy: (productId: number) => void;
}

export default function ProductCard({ product, onBuy }: Props) {
  return (
    
      <div className="product-card">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-info">
          <h2 className="product-name">{product.name}</h2>
          <p className="product-price">Giá: ${product.price}</p>
          <button
            onClick={() => onBuy(product.id)}
            className="btn-primary" style={{width: '100%'}}
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
  );
}
