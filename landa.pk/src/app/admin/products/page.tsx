"use client";

import { useState, useEffect } from "react";
import {
  MoreHorizontal,
  Search,
  Plus,
  Check,
  X,
  Trash2,
  Edit,
  Eye,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchProducts } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "@/lib/axios";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showDeleted, setShowDeleted] = useState(false);

  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts({
        search: searchTerm,
        page: currentPage,
        limit: 10,
        sortBy,
        order: sortOrder,
        includeDeleted: showDeleted,
      });

      setProducts(response.products || []);
      setTotalPages(Math.ceil((response.totalProducts || 0) / 10));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, [currentPage, sortBy, sortOrder, showDeleted]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProductsData();
  };

  const handleToggleAvailability = async (
    productId: string,
    currentStatus: boolean
  ) => {
    try {
      await axios.put(`/products/${productId}`, {
        isAvailable: !currentStatus,
      });

      // Update local state
      setProducts(
        products.map((product) =>
          product._id === productId
            ? { ...product, isAvailable: !currentStatus }
            : product
        )
      );
    } catch (error) {
      console.error("Error toggling product availability:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`/products/${productId}`);

      // Update local state
      setProducts(
        products.map((product) =>
          product._id === productId ? { ...product, isDeleted: true } : product
        )
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleRestoreProduct = async (productId: string) => {
    try {
      await axios.put(`/products/${productId}/restore`);

      // Update local state
      setProducts(
        products.map((product) =>
          product._id === productId ? { ...product, isDeleted: false } : product
        )
      );
    } catch (error) {
      console.error("Error restoring product:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your store products.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button type="submit" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={sortBy}
                onValueChange={(value) => {
                  setSortBy(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Added</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="title">Name</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortOrder}
                onValueChange={(value: "asc" | "desc") => {
                  setSortOrder(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showDeleted"
                  checked={showDeleted}
                  onChange={() => setShowDeleted(!showDeleted)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="showDeleted" className="text-sm">
                  Show Deleted
                </label>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No products found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow
                          key={product._id}
                          className={product.isDeleted ? "bg-muted/50" : ""}
                        >
                          <TableCell>
                            <div className="relative h-10 w-10 overflow-hidden rounded-md">
                              {product.image ? (
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                  <Package className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.title}
                          </TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            {product.category || "Uncategorized"}
                          </TableCell>
                          <TableCell>
                            {product.isDeleted ? (
                              <Badge variant="destructive">Deleted</Badge>
                            ) : product.isAvailable ? (
                              <Badge variant="default">Available</Badge>
                            ) : (
                              <Badge variant="outline">Unavailable</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {product.seller?.name || "Unknown"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                {!product.isDeleted && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleToggleAvailability(
                                          product._id,
                                          product.isAvailable
                                        )
                                      }
                                    >
                                      {product.isAvailable ? (
                                        <>
                                          <X className="mr-2 h-4 w-4" />
                                          Mark Unavailable
                                        </>
                                      ) : (
                                        <>
                                          <Check className="mr-2 h-4 w-4" />
                                          Mark Available
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeleteProduct(product._id)
                                      }
                                      className="text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {product.isDeleted && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleRestoreProduct(product._id)
                                    }
                                  >
                                    <Check className="mr-2 h-4 w-4" />
                                    Restore
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
