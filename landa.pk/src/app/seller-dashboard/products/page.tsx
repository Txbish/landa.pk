"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash, Search, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { AddProductModal } from "@/components/dashboard/products/add-product-modal";
import { EditProductModal } from "@/components/dashboard/products/edit-product-modal";
import { DeleteProductModal } from "@/components/dashboard/products/delete-product-modal";
import type { Product } from "@/lib/types";

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const data = await fetchProducts({
          sortBy,
          order: sortOrder,
          search: searchTerm || undefined,
        });

        const sellerProducts = data.products.filter(
          (product) => product.seller._id === user?._id
        );

        setProducts(sellerProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProducts();
    }
  }, [user, sortBy, sortOrder, searchTerm]);

  const handleAddProduct = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
  };

  const handleDeleteProduct = (deletedProductId: string) => {
    setProducts(products.filter((product) => product._id !== deletedProductId));
  };

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.category &&
        product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="createdAt">Date Added</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortOrder}
                onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center">
              <p className="mb-4 text-lg font-medium text-gray-500">
                No products found
              </p>
              <Button onClick={() => setAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <div className="relative h-12 w-12 overflow-hidden rounded-md">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
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
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            product.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.isAvailable ? "Available" : "Sold"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSelectedProduct(product);
                              setEditModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSelectedProduct(product);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      <AddProductModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {selectedProduct && (
        <>
          <EditProductModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            product={selectedProduct}
            onEditProduct={handleEditProduct}
          />
          <DeleteProductModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            product={selectedProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        </>
      )}
    </div>
  );
}
