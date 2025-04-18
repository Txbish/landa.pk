import axios from "@/lib/axios";
import { Product } from "@/lib/types";
import { PaginatedProductsResponse } from "@/lib/types";
interface FetchProductsParams {
  category?: string|null;
  minPrice?: number|null;
  maxPrice?: number|null;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
  page?:number;
  limit?: number;
}

export async function fetchLandingPageProducts(params?: FetchProductsParams): Promise<PaginatedProductsResponse> {
  const response = await axios.get("/products", { params });
  return response.data;
}
export async function fetchProducts(params?: FetchProductsParams): Promise<PaginatedProductsResponse> {
  const response = await axios.get<PaginatedProductsResponse>("/products", { params });
  return response.data;
}