"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Order } from "@/lib/types";
import { updateItemStatus, updateOrderStatus } from "@/services/orderService";
import Image from "next/image";

interface OrderDetailsModalProps {
  open: boolean;
  onClose: () => void;
  order: Order;
  onOrderUpdate: (order: Order) => void;
}

export function OrderDetailsModal({
  open,
  onClose,
  order,
  onOrderUpdate,
}: OrderDetailsModalProps) {
  const [loading, setLoading] = useState(false);

  const handleUpdateItemStatus = async (
    itemId: string,
    status: "Pending" | "Cancelled" | "Completed"
  ) => {
    try {
      setLoading(true);
      const updatedOrder = await updateItemStatus(order._id, itemId, status);
      onOrderUpdate(updatedOrder);
    } catch (error) {
      console.error("Failed to update item status:", error);
      alert("Failed to update item status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (
    status: "Pending" | "Cancelled" | "Completed"
  ) => {
    try {
      setLoading(true);
      const updatedOrder = await updateOrderStatus(order._id, status);
      onOrderUpdate(updatedOrder);
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-gray-500">Order ID</h3>
              <p className="text-sm">{order._id}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Date</h3>
              <p className="text-sm">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Customer</h3>
              <p className="text-sm">{order.contactName}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Contact</h3>
              <p className="text-sm">{order.contactEmail}</p>
              <p className="text-sm">{order.contactPhone}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-medium text-gray-500">Shipping Address</h3>
              <p className="text-sm">{order.shippingAddress}</p>
            </div>
            {order.additionalNotes && (
              <div className="md:col-span-2">
                <h3 className="font-medium text-gray-500">Notes</h3>
                <p className="text-sm">{order.additionalNotes}</p>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div>
            <h3 className="mb-4 font-semibold">Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{item.product.title}</h4>
                      <p className="text-sm text-gray-500">
                        ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Select
                      value={item.itemStatus}
                      onValueChange={(
                        value: "Pending" | "Cancelled" | "Completed"
                      ) => handleUpdateItemStatus(item._id, value)}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Status */}
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <h3 className="font-medium text-gray-500">Order Status</h3>
              <p
                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                  order.overallStatus === "Completed"
                    ? "bg-green-100 text-green-800"
                    : order.overallStatus === "Cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.overallStatus}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select
                value={order.overallStatus}
                onValueChange={(value: "Pending" | "Cancelled" | "Completed") =>
                  handleUpdateOrderStatus(value)
                }
                disabled={loading}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
