"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/lib/types";

interface DeleteProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  onDeleteProduct: (productId: string) => void;
}

export function DeleteProductModal({
  open,
  onClose,
  product,
  onDeleteProduct,
}: DeleteProductModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/products/${product._id}`);
      onDeleteProduct(product._id);
      onClose();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{product.title}"? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
