"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  Truck,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
} from "lucide-react";
import {
  fetchOrderById,
  updateOrderStatus,
  updateItemStatus,
} from "@/services/orderService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setID] = useState<string>("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const { id } = await params;
        setID(id);
      } catch (error) {
        console.error("Error retrieving order ID from params:", error);
      }
    };
    init();
  }, [params]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await fetchOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleUpdateOrderStatus = async (
    status: "Pending" | "Cancelled" | "Completed"
  ) => {
    if (
      order?.overallStatus === "Completed" ||
      order?.overallStatus === "Cancelled"
    ) {
      console.log(
        "Cannot change the overall status of a completed or cancelled order."
      );
      return;
    }

    try {
      const updatedOrder = await updateOrderStatus(id, status);
      setOrder(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleUpdateItemStatus = async (
    itemId: string,
    status: "Pending" | "Cancelled" | "Completed"
  ) => {
    const item = order?.items.find((item: any) => item._id === itemId);

    if (item?.itemStatus === "Completed" || item?.itemStatus === "Cancelled") {
      console.log(
        `Cannot change the status of an item that is already ${item.itemStatus}.`
      );
      return;
    }

    try {
      const updatedOrder = await updateItemStatus(id, itemId, status);
      setOrder(updatedOrder);
    } catch (error) {
      console.error("Error updating item status:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "Partial Completed":
        return <Badge className="bg-blue-500">Partial Completed</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "Partial Cancelled":
        return <Badge className="bg-orange-500">Partial Cancelled</Badge>;
      default:
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-500"
          >
            Pending
          </Badge>
        );
    }
  };

  const canUpdateOrderStatus = !["Completed", "Cancelled"].includes(
    order?.overallStatus
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h2 className="text-xl font-semibold">Order not found</h2>
        <Button variant="link" onClick={() => router.push("/admin/orders")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/admin/orders")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              Order #{order._id.substring(0, 8)}
            </h1>
            <p className="text-muted-foreground">
              Placed on{" "}
              {order.createdAt
                ? format(new Date(order.createdAt), "MMMM dd, yyyy")
                : "N/A"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Current status label */}
          <div className="text-lg font-semibold text-gray-900">
            Current Status: {getStatusBadge(order.overallStatus)}
          </div>
          {/* Dropdown for updating status */}
          <Select
            value={order.overallStatus}
            onValueChange={(value: "Pending" | "Cancelled" | "Completed") =>
              canUpdateOrderStatus && handleUpdateOrderStatus(value)
            }
            disabled={!canUpdateOrderStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">{order.contactName}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                {order.contactEmail}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-2 h-4 w-4" />
                {order.contactPhone}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{order.shippingAddress}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Order Items
            </CardTitle>
            <CardDescription>
              {order.items?.length || 0} items in this order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {order.items?.map((item: any) => (
                    <tr key={item._id}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-md bg-gray-100">
                            {item.product?.image ? (
                              <Image
                                src={item.product.image || "/placeholder.svg"}
                                alt={item.product.title}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <span className="text-xs">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {item.product?.title}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {item.product?.price && item.product.price.toFixed(2)}$
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {getStatusBadge(item.itemStatus)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-right">
                        <Select
                          value={item.itemStatus}
                          onValueChange={(
                            value: "Pending" | "Completed" | "Cancelled"
                          ) => handleUpdateItemStatus(item._id, value)}
                          disabled={
                            item.itemStatus === "Completed" ||
                            item.itemStatus === "Cancelled"
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Item Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Order Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.additionalNotes ? (
              <p className="whitespace-pre-line">{order.additionalNotes}</p>
            ) : (
              <p className="text-muted-foreground">
                No additional notes provided.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.totalAmount?.toFixed(2) || "0.00"}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${order.totalAmount?.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
