import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductDetail from "@/components/products/product-detail";
import ProductDetailSkeleton from "@/components/products/product-detail-skeleton";
import { fetchProductById } from "@/services/productService";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    console.log("Product ID:", id);
    const product = await fetchProductById(id);
    console.log("Product data:", product);

    return (
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<ProductDetailSkeleton />}>
          <ProductDetail product={product} />
        </Suspense>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
