"use client";

import { useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useOnClickOutside } from "@/hooks/use-click-outside";

export function Cart() {
  const {
    cartItems,
    isCartOpen,
    totalItems,
    totalAmount,
    loading,
    removeFromCart,
    closeCart,
  } = useCart();

  const cartRef = useRef<HTMLDivElement>(null);

  // Fix TypeScript type mismatch by asserting the type
  useOnClickOutside(cartRef as React.RefObject<HTMLElement>, closeCart);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div
        ref={cartRef}
        className="bg-background w-full max-w-md h-full flex flex-col shadow-xl animate-in slide-in-from-right"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
            <span className="text-sm font-normal text-muted-foreground">
              ({totalItems} {totalItems === 1 ? "item" : "items"})
            </span>
          </h2>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Your cart is empty</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button onClick={closeCart}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto p-4">
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li key={item._id} className="flex gap-4 pb-4 border-b">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <h4 className="font-medium line-clamp-1">
                          {item.product.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.product.category}
                      </p>
                      <div className="flex justify-between items-end mt-auto">
                        <div className="text-sm">Qty: {item.quantity}</div>
                        <div className="font-medium">
                          Rs. {item.price * item.quantity}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 border-t">
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span className="font-medium">Rs. {totalAmount}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-semibold">
                <span>Total</span>
                <span>Rs. {totalAmount}</span>
              </div>
              <Link href="/checkout" onClick={closeCart}>
                <Button className="w-full mt-4">Proceed to Checkout</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
