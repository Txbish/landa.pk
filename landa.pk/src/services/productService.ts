import axios from "@/lib/axios"
import type { Product } from "@/lib/types"
import type { PaginatedProductsResponse } from "@/lib/types"

interface FetchProductsParams {
  category?: string | null
  minPrice?: number | null
  maxPrice?: number | null
  sortBy?: string
  order?: "asc" | "desc"
  search?: string
  page?: number
  limit?: number
  includeDeleted?: boolean
  isAvailable?: boolean
}

export async function fetchLandingPageProducts(params?: FetchProductsParams): Promise<PaginatedProductsResponse> {
  const response = await axios.get("/products", { params })
  return response.data
}

export async function fetchProducts(params?: FetchProductsParams): Promise<PaginatedProductsResponse> {
  const response = await axios.get<PaginatedProductsResponse>("/products", { params })
  return response.data
}

export async function fetchSellerProducts(params?: FetchProductsParams): Promise<PaginatedProductsResponse> {
  const response = await axios.get<PaginatedProductsResponse>("/products/seller", { params })
  return response.data
}
export async function fetchProductById(id: string): Promise<Product> {
  const response = await axios.get<Product>(`/products/${id}`)
  return response.data
}

export async function fetchRelatedProducts(id: string, limit = 4): Promise<Product[]> {
  const response = await axios.get<Product[]>(`/products/${id}/related`, { params: { limit } })
  return response.data
}
