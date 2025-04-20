import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/products/product-detail";
import ProductDetailSkeleton from "@/components/products/product-detail-skeleton";
import { fetchProductById } from "@/services/productService";

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const product = await fetchProductById(params.id);

    return {
      title: `${product.title} | HawkTU`,
      description: product.description,
      openGraph: {
        images: [{ url: product.image }],
      },
    };
  } catch (error) {
    return {
      title: "Product | HawkTU",
      description: "View product details",
    };
  }
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const product = await fetchProductById(params.id);

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
