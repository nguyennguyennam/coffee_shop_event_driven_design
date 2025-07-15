// Order Aggregate
// Drink Aggregate

import { Payment } from './payment'; // Assuming you have a Payment type defined
export interface Drink {
  id: string;
  name?: string;
  size?: string;
  description?: string;
  type?: string;
  ingredient: Ingredient[]; // Đã thay thế IngredientUsage bằng Ingredient
  price: number;
  isAvailable: boolean;
  image?: string;
}

// Customer Aggregate
export type CustomerType = "Regular" | "Premium";
export interface Customer {
  id: string;
  name?: string;
  email?: string;
  dateOfBirth: string; // ISO date string
  type: CustomerType;
}

// Voucher Entity
export interface Voucher {
  id: string;
  code?: string;
  expirationDate: string; // ISO date string
  description?: string;
  discountAmount?: DiscountAmount; // Bạn cần định nghĩa thêm interface DiscountAmount
  isUsed: boolean;
}

// OrderItem Entity
export interface OrderItem {
  id: string;
  drinkId: string; // Tên đúng như DTO
  drinkName?: string;
  quantity: number;
  price: number; // Chỉ dùng ở frontend để tính tổng tiền
  image?: string; // Thêm tùy chọn hiển thị ảnh trong UI
}

export interface Order {
  id: string;
  customerId: string;
  voucherCode?: string;
  customerType: number; // enum từ backend: Regular, VIP,...
  orderDate?: string; // ISO date string
  totalPrice: number;
  status?: string;
  orderItems: OrderItem[];
}
// Ingredient Entity
export interface Ingredient {
  id: string;
  name?: string;
  type?: string;
  unit?: string;
  costPerUnit: number;
  quantity: number;
  isAvailable: boolean;
}

// DiscountAmount Entity
export interface DiscountAmount {
  amount: number;
}

// Add new OrderDetail interface without modifying other interfaces
export interface OrderDetail extends Order {
  paymentDate?: string;
  payment?: Payment;
}