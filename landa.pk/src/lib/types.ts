export interface SellerDetails {
  businessName: string;
  earnings: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  address?: string;
  phone?: string;
  profileImage?: string;
  sellerDetails?: SellerDetails;
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<User>) => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
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
  isDeleted:boolean;
  createdAt:string;
  updatedAt:string;
}

export interface PaginatedProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
}

export interface CreateOrderPayload {
  shippingAddress: string;
  additionalNotes?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface OrderItem {
  _id: string;
  product: Product; 
  seller: User;
  itemStatus: "Pending" | "Cancelled" | "Completed"; 
}
export interface Order {
  _id: string
  user: User | string
  items: OrderItem[]
  totalAmount: number
  overallStatus: "Pending" | "Cancelled" | "Completed"|"Partial Completed" |"Partial Cancelled";
  shippingAddress: string
  contactName: string
  contactEmail: string
  contactPhone: string
  additionalNotes?: string
  createdAt: string
  updatedAt: string
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

