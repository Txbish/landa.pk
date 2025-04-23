"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from "@/lib/types";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { CATEGORIES } from "@/lib/categories";

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  onEditProduct: (product: Product) => void;
}

export function EditProductModal({
  open,
  onClose,
  product,
  onEditProduct,
}: EditProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    isAvailable: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description || "",
        price: product.price.toString(),
        category: product.category || "",
        isAvailable: product.isAvailable,
      });
      setImagePreview(product.image);
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(product.image);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      let imageUrl = product.image;

      // Upload new image if changed
      if (imageFile) {
        const imageData = new FormData();
        imageData.append("file", imageFile);
        imageData.append("upload_preset", "thrift_store");

        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/your-cloud-name/image/upload",
          {
            method: "POST",
            body: imageData,
          }
        );

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.secure_url;
      }

      // Update product
      const productData = {
        title: formData.title,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        image: imageUrl,
        isAvailable: formData.isAvailable,
      };

      const response = await axios.put(`/products/${product._id}`, productData);
      onEditProduct(response.data);
      onClose();
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Product Image</Label>
              {imagePreview ? (
                <div className="relative mt-2 h-48 w-full overflow-hidden rounded-md">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Product preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 rounded-full bg-white p-1 shadow-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50">
                  <label
                    htmlFor="image-upload"
                    className="flex cursor-pointer flex-col items-center"
                  >
                    <Upload className="mb-2 h-6 w-6 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                      Click to upload image
                    </span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="isAvailable">Availability</Label>
              <Select
                value={formData.isAvailable ? "true" : "false"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    isAvailable: value === "true",
                  })
                }
              >
                <SelectTrigger id="isAvailable">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Available</SelectItem>
                  <SelectItem value="false">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
