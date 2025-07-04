// src/types/index.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;                  // added
  category: string;               // replaced `type`
  rating: number;                 // added
  description: string;            // added
  isFavorite: boolean;            // added
}

export interface User {
  id: number;
  username: string;
  email: string;
}
