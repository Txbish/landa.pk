import axiosInstance from "@/lib/axios";
import { SellerRequest } from "@/lib/types";

export const fetchUserSellerRequest = async (): Promise<SellerRequest | null> => {
  try {
    const response = await axiosInstance.get("/seller-requests");
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const submitSellerRequest = async (businessName: string, reason: string): Promise<SellerRequest> => {
  const response = await axiosInstance.post("/seller-requests", { businessName, reason });
  return response.data;
};

export const fetchAllSellerRequests = async (): Promise<SellerRequest[]> => {
  const response = await axiosInstance.get("/seller-requests/all");
  return response.data;
};

export const handleSellerRequest = async (
  id: string,
  status: "Approved" | "Rejected"
): Promise<SellerRequest> => {
  const response = await axiosInstance.put(`/seller-requests/${id}`, { status });
  return response.data;
};