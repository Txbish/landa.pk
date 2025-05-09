import axiosInstance from "@/lib/axios";
import { CreateOrderPayload } from "@/lib/types";
export const fetchOrders = async () => {
  const response = await axiosInstance.get("/orders");
  return response.data;
};
export const fetchUserOrders = async () => {
  const response = await axiosInstance.get("/orders/userOrder");
  return response.data;
};

export const fetchSellerOrders = async () => {
  const response = await axiosInstance.get("/orders/sellerOrder");
  return response.data;
};  
export const fetchOrderById = async (orderId: string) => {
  const response = await axiosInstance.get(`/orders/${orderId}`);
  return response.data; 
};

export const createOrder = async (orderData: CreateOrderPayload) => {
  const response = await axiosInstance.post("/orders", orderData);
  return response.data; 
};

export const updateOrderStatus = async (orderId: string, status: "Pending" | "Cancelled" | "Completed") => {
  const response = await axiosInstance.put(`/orders/${orderId}`, { status });
  return response.data; 
};

export const updateItemStatus = async (
  orderId: string,
  itemId: string,
  itemStatus: "Pending" | "Cancelled" | "Completed"
) => {
  const response = await axiosInstance.put(`/orders/${orderId}/item`, {
    itemId,
    itemStatus,
  });
  return response.data; // Returns the updated order
};