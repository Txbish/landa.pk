"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchUserOrders,
  updateOrderStatus,
  updateItemStatus,
} from "@/services/orderService";
import { Order, OrderItem } from "@/lib/types";

export default function MyOrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  const [cancelItemId, setCancelItemId] = useState<string | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoadingOrders(true);
        const data = await fetchUserOrders();
        setOrders(data.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to fetch orders. Please try again.");
      } finally {
        setIsLoadingOrders(false);
      }
    };

    if (user) loadOrders();
  }, [user]);

  const handleCancelItem = async () => {
    if (!cancelOrderId || !cancelItemId) return;

    setIsCancelling(true);
    try {
      await updateItemStatus(cancelOrderId, cancelItemId, "Cancelled");
      setOrders((prev) =>
        prev.map((order) =>
          order._id === cancelOrderId
            ? {
                ...order,
                items: order.items.map((item) =>
                  item._id === cancelItemId
                    ? { ...item, itemStatus: "Cancelled" }
                    : item
                ),
              }
            : order
        )
      );
      toast.success("Item cancelled successfully.");
    } catch (err) {
      toast.error("Failed to cancel item.");
    } finally {
      setIsCancelling(false);
      setCancelItemId(null);
      setCancelOrderId(null);
      setOpenItemDialog(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelOrderId) return;

    setIsCancelling(true);
    try {
      await updateOrderStatus(cancelOrderId, "Cancelled");
      setOrders((prev) =>
        prev.map((order) =>
          order._id === cancelOrderId
            ? {
                ...order,
                overallStatus: "Cancelled",
                items: order.items.map((item) => ({
                  ...item,
                  itemStatus: "Cancelled",
                })),
              }
            : order
        )
      );
      toast.success("Order cancelled successfully.");
    } catch (err) {
      toast.error("Failed to cancel order.");
    } finally {
      setIsCancelling(false);
      setCancelOrderId(null);
      setOpenOrderDialog(false);
    }
  };

  const getStatusBadge = (
    status:
      | "Pending"
      | "Cancelled"
      | "Completed"
      | "Partial Completed"
      | "Partial Cancelled"
  ) => {
    const badgeStyles: Record<string, string> = {
      Pending: "bg-yellow-50 text-yellow-700",
      Cancelled: "bg-red-50 text-red-700",
      Completed: "bg-green-50 text-green-700",
      "Partial Completed": "bg-blue-50 text-blue-700",
      "Partial Cancelled": "bg-orange-50 text-orange-700",
    };

    return (
      <Badge variant="outline" className={badgeStyles[status]}>
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading || isLoadingOrders) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
            <p className="mt-2 text-center text-muted-foreground">
              You haven't placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <Button className="mt-6">Start Shopping</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>
      <Accordion type="single" collapsible className="space-y-4">
        {orders.map((order) => (
          <AccordionItem
            key={order._id}
            value={order._id}
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex flex-1 flex-col items-start space-y-1 text-left sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div>
                  <p className="font-medium">Order #{order._id.slice(-6)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)} • {order.items.length} item(s)
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm font-medium">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                  {getStatusBadge(order.overallStatus)}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 pb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell className="flex items-center space-x-3">
                          <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.product.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.product.category}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>${item.product.price.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(item.itemStatus)}</TableCell>
                        <TableCell>
                          {item.itemStatus === "Pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setCancelItemId(item._id);
                                  setCancelOrderId(order._id);
                                  setOpenItemDialog(true);
                                }}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 flex justify-between">
                  <p className="text-sm font-medium">
                    Order Total: ${order.totalAmount.toFixed(2)}
                  </p>
                  {order.overallStatus === "Pending" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setCancelOrderId(order._id);
                        setOpenOrderDialog(true);
                      }}
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Cancel Item Dialog */}
      <Dialog open={openItemDialog} onOpenChange={setOpenItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this item?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenItemDialog(false)}>
              No, keep it
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelItem}
              disabled={isCancelling}
            >
              {isCancelling && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Yes, cancel item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog open={openOrderDialog} onOpenChange={setOpenOrderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order and all its items?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenOrderDialog(false)}>
              No, keep it
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isCancelling}
            >
              {isCancelling && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Yes, cancel order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
