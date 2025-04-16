// Product type
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  address?: string;
  phone?: string;
  profileImage?: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  seller: User;
  isAvailable: boolean;
}

// Paginated response for products
export interface PaginatedProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
}

// User type

// Order item type
export interface OrderItem {
  _id: string;
  product: Product; // Reference to the Product type
  itemStatus: "Pending" | "Cancelled" | "Completed"; // Status of the item in the order
}

// Order type
export interface Order {
  _id: string;
  user: User; // Reference to the User type
  items: OrderItem[]; // List of items in the order
  totalAmount: number; // Total amount for the order
  overallStatus: "Pending" | "Cancelled" | "Completed"; // Overall status of the order
  createdAt: string; // Timestamp for when the order was created
  updatedAt: string; // Timestamp for when the order was last updated
}

// Seller request type
// Seller request type
export interface SellerRequest {
  _id: string; // Unique identifier for the seller request
  user: User; // Reference to the User type
  businessName: string; // Name of the business
  reason: string; // Reason for the seller request
  status: "Pending" | "Approved" | "Rejected"; // Status of the seller request
  createdAt: string; // Timestamp for when the request was created
  updatedAt: string; // Timestamp for when the request was last updated
}

// API response for paginated orders
export interface PaginatedOrdersResponse {
  orders: Order[]; // List of orders
  totalPages: number; // Total number of pages
  currentPage: number; // Current page number
  totalOrders: number; // Total number of orders
}

// API response for seller requests
export interface SellerRequestsResponse {
  requests: SellerRequest[]; // List of seller requests
  totalPages: number; // Total number of pages
  currentPage: number; // Current page number
  totalRequests: number; // Total number of requests
}

