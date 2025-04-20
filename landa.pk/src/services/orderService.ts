import axiosInstance from "@/lib/axios";

export const fetchOrders = async () => {
  const response = await axiosInstance.get("/orders");
  return response.data;
};
export const fetchUserOrders = async () => {
  const response = await axiosInstance.get("/orders/userOrder");
  return response.data;
};
export const fetchOrderById = async (orderId: string) => {
  const response = await axiosInstance.get(`/orders/${orderId}`);
  return response.data; 
};

// Create a new order
export const createOrder = async (orderData: {
  items: { product: string;  price: number }[];
  totalAmount: number;
}) => {
  const response = await axiosInstance.post("/orders", orderData);
  return response.data; // Returns the created order
};

// Update the overall status of an order
export const updateOrderStatus = async (orderId: string, status: "Pending" | "Cancelled" | "Completed") => {
  const response = await axiosInstance.put(`/orders/${orderId}`, { status });
  return response.data; // Returns the updated order
};

// Update the status of a specific item in an order
export const updateItemStatus = async (
  orderId: string,
  itemId: string,
  itemStatus: "Pending" | "Cancelled" | "Completed"
) => {
  const response = await axiosInstance.put(`/orders/${orderId}`, {
    itemId,
    itemStatus,
  });
  return response.data; // Returns the updated order
};