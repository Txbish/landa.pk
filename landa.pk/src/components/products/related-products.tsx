"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import { fetchRelatedProducts } from "@/services/productService";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedProductsProps {
  productId: string;
}

export default function RelatedProducts({ productId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchRelatedProducts(productId);
        setProducts(data);
      } catch (error) {
        console.error("Failed to load related products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRelatedProducts();
  }, [productId]);

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-4 w-1/4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link key={product._id} href={`/products/${product._id}`}>
            <Card className="h-full border rounded-lg overflow-hidden transition-all hover:shadow-md">
              <div className="relative aspect-square">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium line-clamp-1">{product.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {product.category}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <p className="font-bold">${product.price.toFixed(2)}</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
