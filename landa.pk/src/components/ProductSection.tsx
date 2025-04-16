"use client";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { fetchLandingPageProducts } from "../services/productService"; // Import the fetch function
import Link from "next/link";

const ProductsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products based on the selected category
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchLandingPageProducts({
          category: selectedCategory === "All" ? undefined : selectedCategory,
          limit: 8,
        });

        setProducts(response.products);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [selectedCategory]);

  return (
    <div className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-landa-green mb-3">
          Our Groovy Finds
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our curated collection of unique vintage treasures. Each item
          tells a story and brings the charm of the past into your present.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {/* All Categories Button */}
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-4 py-2 rounded-full transition-colors ${
            selectedCategory === "All"
              ? "bg-landa-green text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          All Categories
        </button>

        {/* Dynamic Category Buttons */}
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === category
                ? "bg-landa-green text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <Link href="/products">
          <button className="landa-button">View All Products</button>
        </Link>
      </div>
    </div>
  );
};

export default ProductsSection;
