import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductDetail from "@/components/products/product-detail";
import ProductDetailSkeleton from "@/components/products/product-detail-skeleton";
import { fetchProductById } from "@/services/productService";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  try {
    const { id } = await params;
    const product = await fetchProductById(id);

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
