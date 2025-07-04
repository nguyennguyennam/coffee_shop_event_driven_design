// src/components/ProductCard.tsx

import React from 'react';
import { Product } from '../types';

interface Props {
  product: Product;
  onBuy: (productId: number) => void;
}

export default function ProductCard({ product, onBuy }: Props) {
  return (
    <div className="border rounded-lg p-3 shadow-md hover:shadow-lg transition">
      <img src={product.image} alt={product.name} className="w-full h-32 object-cover mb-2 rounded" />
      <h3 className="text-lg font-bold">{product.name}</h3>
      <p className="text-gray-700">Giá: ${product.price}</p>
      <button
        onClick={() => onBuy(product.id)}
        className="mt-3 px-4 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        Mua
      </button>
    </div>
  );
}
