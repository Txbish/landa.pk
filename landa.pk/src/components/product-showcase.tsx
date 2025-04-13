"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types";

interface ProductShowcaseProps {
  products: Product[];
}

export default function ProductShowcase({ products }: ProductShowcaseProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {products.map((product) => (
        <Link
          href={`/products/${product._id}`}
          key={product._id}
          className="block"
        >
          <Card
            className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg"
            onMouseEnter={() => setHoveredProduct(product._id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
              />
              {product.category && (
                <Badge className="absolute top-3 left-3 z-10">
                  {product.category}
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg line-clamp-1">
                {product.title}
              </h3>
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                {product.description}
              </p>
              <div className="mt-2 font-semibold">
                ${product.price.toFixed(2)}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div
                className={`w-full transition-all duration-300 ${
                  hoveredProduct === product._id
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <Button variant="secondary" className="w-full">
                  Shop Now
                </Button>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
