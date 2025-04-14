"use client";
import Link from "next/link";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";
import ProductShowcase from "@/components/product-showcase"; // Import ProductShowcase

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters and pagination state
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("price");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Fetch products whenever filters or pagination state changes
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const response = await fetchProducts({
          category,
          search,
          sortBy,
          order,
          minPrice,
          maxPrice,
          page,
          limit,
        });
        setProducts(response.products); // Assuming API returns { products, totalPages }
        setTotalPages(response.totalPages);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [category, search, sortBy, order, minPrice, maxPrice, page, limit]);

  // Handlers for filters and pagination
  const handleCategoryChange = (newCategory: string | null) => {
    setCategory(newCategory);
    setPage(1); // Reset to first page
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setPage(1); // Reset to first page
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrder(e.target.value as "asc" | "desc");
    setPage(1); // Reset to first page
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "min" | "max"
  ) => {
    const value = e.target.value ? Number(e.target.value) : null;
    if (type === "min") setMinPrice(value);
    if (type === "max") setMaxPrice(value);
    setPage(1); // Reset to first page
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              All Products
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Browse our complete collection of premium clothing and
              accessories.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              variant={category === null ? "default" : "outline"}
              className="rounded-full"
              onClick={() => handleCategoryChange(null)}
            >
              All
            </Button>
            {[
              "T-Shirts",
              "Jeans",
              "Shirts",
              "Sweaters",
              "Jackets",
              "Pants",
            ].map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                className="rounded-full"
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice || ""}
              onChange={(e) => handlePriceChange(e, "min")}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice || ""}
              onChange={(e) => handlePriceChange(e, "max")}
              className="border p-2 rounded"
            />
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="border p-2 rounded"
            >
              <option value="price">Price</option>
              <option value="title">Title</option>
            </select>
            <select
              value={order}
              onChange={handleOrderChange}
              className="border p-2 rounded"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* Products */}
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <ProductShowcase products={products} /> // Use ProductShowcase here
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
