import axios from "@/lib/axios"

export const fetchCart = async () => {
  const response = await axios.get("/cart")
  return response.data
}

export const addItemToCart = async (productId: string, quantity: number) => {
  const response = await axios.post("/cart", { productId, quantity })
  return response.data
}

export const removeItemFromCart = async (itemId: string) => {
  const response = await axios.delete(`/cart/${itemId}`)
  return response.data
}

export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
  const response = await axios.put(`/cart/${itemId}`, { quantity })
  return response.data
}

export const clearCart = async () => {
  const response = await axios.delete("/cart")
  return response.data
}
