import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types";
import { fetchProducts } from "@/services/productService"; // Import fetchProducts function
import { CATEGORIES } from "@/lib/categories"; // Import categories from lib folder
import { debounce } from "lodash"; // Import lodash debounce

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters and pagination state
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(""); // Debounced search state
  const [sortBy, setSortBy] = useState<string>("price");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Debounce the search input
  const debouncedSearchHandler = debounce((value: string) => {
    setDebouncedSearch(value);
    setPage(1); // Reset to the first page when search changes
  }, 500); // 500ms debounce delay

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearchHandler(e.target.value); // Call the debounced handler
  };

  // Fetch products whenever filters or pagination state changes
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const response = await fetchProducts({
          category: category === "All" ? null : category,
          search: debouncedSearch || undefined, // Use debounced search value
          sortBy,
          order,
          minPrice,
          maxPrice,
          page,
          limit,
        });
        setProducts((prev) =>
          page === 1 ? response.products : [...prev, ...response.products]
        ); // Append products for lazy loading
        setTotalPages(response.totalPages);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [category, debouncedSearch, sortBy, order, minPrice, maxPrice, page]);

  // Handle filter changes
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory === "All" ? null : newCategory);
    setPage(1); // Reset to the first page
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setPage(1); // Reset to the first page
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrder(e.target.value as "asc" | "desc");
    setPage(1); // Reset to the first page
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "min" | "max"
  ) => {
    const value = e.target.value ? Number(e.target.value) : null;
    if (type === "min") setMinPrice(value);
    if (type === "max") setMaxPrice(value);
    setPage(1); // Reset to the first page
  };

  // Lazy load more products when scrolling to the bottom
  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        handleLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, totalPages, loading]);

  return (
    <div>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-landa-green mb-3">
            Groovy Treasures
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our full collection of one-of-a-kind vintage finds. Each
            piece has been carefully selected for its quality and character.
          </p>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 rounded-full bg-landa-green/20 border-none focus:ring-landa-green focus:outline-none"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="w-full md:w-auto">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full px-4 py-2 rounded-full bg-landa-green/20 border-none focus:ring-landa-green focus:outline-none"
            >
              <option value="price">Sort By: Price</option>
              <option value="name">Sort By: Name</option>
            </select>
          </div>

          {/* Order Dropdown */}
          <div className="w-full md:w-auto">
            <select
              value={order}
              onChange={handleOrderChange}
              className="w-full px-4 py-2 rounded-full bg-landa-green/20 border-none focus:ring-landa-green focus:outline-none"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex overflow-x-auto gap-4 mb-8 pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-sm font-medium whitespace-nowrap transition-colors ${
                category === cat || (cat === "All" && !category)
                  ? "bg-landa-green text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading && page === 1 ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">
              No products found matching your criteria.
            </p>
          </div>
        )}

        {/* Lazy Loading Spinner */}
        {loading && page > 1 && (
          <div className="text-center mt-4">
            <p>Loading more products...</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
