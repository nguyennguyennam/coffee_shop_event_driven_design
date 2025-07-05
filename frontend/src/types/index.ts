// Order Aggregate
export interface Order {
  id: string;
  customerId: string;
  voucherId?: string;
  orderDate: string; // ISO date string
  status?: string;
  orderItems: OrderItem[];
  voucher?: Voucher;
  totalPrice: number;
}

// Drink Aggregate
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
  drinkName: string;
  drinkId: string;
  quantity: number;
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