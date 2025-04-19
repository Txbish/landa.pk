"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "@/lib/axios";
import { Product } from "@/lib/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  totalItems: number;
  totalAmount: number;
  loading: boolean;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  // Calculate total items and amount
  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const totalAmount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  // Fetch cart items from the backend
  const fetchCartItems = useCallback(async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get("/cart");
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      toast.error("Failed to load your cart");
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // Fetch cart on initial load and when login status changes
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems, isLoggedIn]);

  // Add item to cart
  const addToCart = useCallback(
    async (product: Product, quantity: number) => {
      if (!isLoggedIn) {
        toast.error("Please log in to add items to your cart");
        return;
      }

      try {
        const response = await axios.post("/cart", {
          productId: product._id,
          quantity,
        });

        setCartItems(response.data.items);
        toast.success("Item added to cart");
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        toast.error("Failed to add item to cart");
      }
    },
    [isLoggedIn]
  );

  // Remove item from cart
  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      const response = await axios.delete(`/cart/${itemId}`);
      setCartItems(response.data.items);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  }, []);

  // Update item quantity
  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        const response = await axios.put(`/cart/${itemId}`, { quantity });
        setCartItems(response.data.items);
      } catch (error) {
        console.error("Failed to update item quantity:", error);
        toast.error("Failed to update item quantity");
      }
    },
    []
  );

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      await axios.delete("/cart");
      setCartItems([]);
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast.error("Failed to clear cart");
    }
  }, []);

  // Toggle cart visibility
  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  // Close cart
  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const value = useMemo<CartContextType>(
    () => ({
      cartItems,
      isCartOpen,
      totalItems,
      totalAmount,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      closeCart,
    }),
    [
      cartItems,
      isCartOpen,
      totalItems,
      totalAmount,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      closeCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
