
export interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  description: string;
  category: string;
  stock: number;
  rating: number;
  publishDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface CartItem {
  bookId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  shippingDetails?: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export type OrderStatus = 
  | "pending" 
  | "processing" 
  | "shipped" 
  | "out-for-delivery" 
  | "delivered";
