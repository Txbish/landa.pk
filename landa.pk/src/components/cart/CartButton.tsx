"use client";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";

export function CartButton() {
  const { toggleCart, totalItems } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleCart}
      className="relative"
      aria-label="Open cart"
    >
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <Badge
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          variant="destructive"
        >
          {totalItems > 99 ? "99+" : totalItems}
        </Badge>
      )}
    </Button>
  );
}
