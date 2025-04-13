"use client";
import Hero from "@/components/hero";
import ProductShowcase from "@/components/product-showcase";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchProducts } from "@/app/services/productService"; // Import the fetchProducts function
import { use, useEffect, useState } from "react";
import { Product } from "@/lib/types";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchProducts({ limit: 5 }); // Fetch only 5 products
        setProducts(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Hero />

        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Featured Collection
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Discover our handpicked selection of the season's most stylish
              pieces.
            </p>
          </div>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <ProductShowcase products={products} />
          )}

          <div className="flex justify-center mt-16">
            <Link href="/products">
              <Button size="lg" className="text-lg px-8 py-6">
                View All Products
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
