"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingCart } from "lucide-react";

// Types based on the provided models
type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  seller: string;
  quantity: number;
  isAvailable: boolean;
};

type OrderItem = {
  _id: string;
  product: Product;
  quantity: number;
  seller: string;
  price: number;
  itemStatus: "Pending" | "Cancelled" | "Completed";
};

type Order = {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  overallStatus: "Pending" | "Cancelled" | "Completed";
  createdAt: string;
};

// Mock orders data for demonstration
const mockOrders: Order[] = [
  {
    _id: "order1",
    user: "user123",
    items: [
      {
        _id: "item1",
        product: {
          _id: "prod1",
          title: "Smartphone",
          description: "Latest model smartphone with advanced features",
          price: 799.99,
          category: "Electronics",
          image: "/placeholder.svg?height=100&width=100",
          seller: "seller1",
          quantity: 10,
          isAvailable: true,
        },
        quantity: 1,
        seller: "seller1",
        price: 799.99,
        itemStatus: "Pending",
      },
      {
        _id: "item2",
        product: {
          _id: "prod2",
          title: "Wireless Earbuds",
          description: "High-quality wireless earbuds with noise cancellation",
          price: 149.99,
          category: "Electronics",
          image: "/placeholder.svg?height=100&width=100",
          seller: "seller2",
          quantity: 20,
          isAvailable: true,
        },
        quantity: 1,
        seller: "seller2",
        price: 149.99,
        itemStatus: "Pending",
      },
    ],
    totalAmount: 949.98,
    overallStatus: "Pending",
    createdAt: "2023-05-15T10:30:00Z",
  },
  {
    _id: "order2",
    user: "user123",
    items: [
      {
        _id: "item3",
        product: {
          _id: "prod3",
          title: "Laptop",
          description: "Powerful laptop for work and gaming",
          price: 1299.99,
          category: "Electronics",
          image: "/placeholder.svg?height=100&width=100",
          seller: "seller1",
          quantity: 5,
          isAvailable: true,
        },
        quantity: 1,
        seller: "seller1",
        price: 1299.99,
        itemStatus: "Completed",
      },
    ],
    totalAmount: 1299.99,
    overallStatus: "Completed",
    createdAt: "2023-04-20T14:45:00Z",
  },
];

export default function MyOrdersPage() {
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [cancelItemId, setCancelItemId] = useState<string | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const { showToast } = useToast();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/orders')
        // const data = await response.json()
        // setOrders(data.orders)

        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setOrders(mockOrders);
          setIsLoadingOrders(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setIsLoadingOrders(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleCancelItem = async () => {
    if (!cancelItemId) return;

    setIsCancelling(true);
    try {
      // In a real app, you would call your API
      // await fetch(`/api/orders/items/${cancelItemId}/cancel`, {
      //   method: 'POST',
      // })

      // For demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          items: order.items.map((item) =>
            item._id === cancelItemId
              ? { ...item, itemStatus: "Cancelled" }
              : item
          ),
        }))
      );

      showToast(
        "The item has been cancelled successfully.",
        "success",
        "Item cancelled"
      );
    } catch (error) {
      console.error("Failed to cancel item:", error);
      showToast(
        "Failed to cancel the item. Please try again.",
        "error",
        "Cancellation failed"
      );
    } finally {
      setIsCancelling(false);
      setCancelItemId(null);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelOrderId) return;

    setIsCancelling(true);
    try {
      // In a real app, you would call your API
      // await fetch(`/api/orders/${cancelOrderId}/cancel`, {
      //   method: 'POST',
      // })

      // For demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
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

      showToast(
        "The order has been cancelled successfully.",
        "success",
        "Order cancelled"
      );
    } catch (error) {
      console.error("Failed to cancel order:", error);
      showToast(
        "Failed to cancel the order. Please try again.",
        "error",
        "Cancellation failed"
      );
    } finally {
      setIsCancelling(false);
      setCancelOrderId(null);
    }
  };

  const getStatusBadge = (status: "Pending" | "Cancelled" | "Completed") => {
    switch (status) {
      case "Pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Pending
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Cancelled
          </Badge>
        );
      case "Completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Completed
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading || isLoadingOrders) {
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
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell className="flex items-center space-x-3">
                          <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                            <img
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
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{getStatusBadge(item.itemStatus)}</TableCell>
                        <TableCell>
                          {item.itemStatus === "Pending" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setCancelItemId(item._id)}
                                >
                                  Cancel
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Cancel Item</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to cancel this item?
                                    This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setCancelItemId(null)}
                                  >
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
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 flex justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Order Total: ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  {order.overallStatus === "Pending" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setCancelOrderId(order._id)}
                        >
                          Cancel Order
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel Order</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to cancel this entire order?
                            This action cannot be undone and will cancel all
                            items in this order.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setCancelOrderId(null)}
                          >
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
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
