export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
    isAvailable: boolean;
}
export interface PaginatedProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
}