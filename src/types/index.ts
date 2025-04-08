export interface User {
  id: string;
  email: string;
  name: string;
  role: "herder" | "admin" | "customer";
  phoneNumber?: string;
  location?: string;
  createdAt: number;
}

export interface Product {
  id: string;
  herderId: string;
  herderName: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  category: "meat" | "dairy";
  subCategory: string;
  images: string[];
  quantity: number;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
  updatedAt: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  herderId: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
    title: string;
  }[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: number;
  updatedAt: number;
  contactPhone: string;
  deliveryAddress: string;
}
