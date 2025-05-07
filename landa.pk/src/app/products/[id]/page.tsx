// app/products/[id]/page.tsx
"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import ProductDetail from "@/components/products/product-detail";
import ProductDetailSkeleton from "@/components/products/product-detail-skeleton";
import { fetchProductById } from "@/services/productService";

const fetcher = (id: string) => fetchProductById(id);

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: product, error, isLoading } = useSWR(id, fetcher);

  if (error) {
    return <div>Product not found.</div>;
  }

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductDetailSkeleton />}>
        {product ? (
          <ProductDetail product={product} />
        ) : (
          <ProductDetailSkeleton />
        )}
      </Suspense>
    </div>
  );
}
