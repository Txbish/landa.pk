"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import ProductImageGallery from "./product-image-gallery";
import RelatedProducts from "./related-products";
import { toast } from "sonner";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await addToCart(product, quantity);
    } catch (error) {
      toast.error("Failed to add product to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Create an array of images for the gallery
  // If product has multiple images, use them, otherwise use the main image
  const galleryImages = [product.image];

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Link
          href="/products"
          className="flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Products
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Images */}
        <ProductImageGallery
          images={galleryImages}
          productName={product.title}
        />

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="px-2 py-1">
                {product.category}
              </Badge>
              {product.isAvailable ? (
                <Badge className="bg-green-500 text-white">In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
          </div>

          <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                className="flex-1 sm:flex-none"
                size="lg"
                onClick={handleAddToCart}
                disabled={isAddingToCart || !product.isAvailable}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="mr-2 h-5 w-5" />
                Add to Wishlist
              </Button>
            </div>
          </div>

          {/* Seller Information */}
          {product.seller && (
            <>
              <Separator />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Seller</h2>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {product.seller.name?.charAt(0) || "S"}
                  </div>
                  <div>
                    <p className="font-medium">
                      {product.seller.name || "Seller"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Member since{" "}
                      {product.seller.createdAt
                        ? new Date(product.seller.createdAt).getFullYear()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Separator className="my-12" />
      <RelatedProducts productId={product._id} />
    </div>
  );
}
