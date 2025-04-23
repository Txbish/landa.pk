"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { fetchUserOrders } from "@/services/orderService";
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
import { Search, Eye } from "lucide-react";
import { OrderDetailsModal } from "@/components/dashboard/orders/order-details-modal";
import type { Order, Product } from "@/lib/types";
export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const productsData = await fetchProducts();
        const sellerProds = productsData.products.filter(
          (product) => product.seller._id === user?._id
        );
        setSellerProducts(sellerProds);

        const ordersData = await fetchUserOrders();

        const sellerOrders = ordersData.orders.filter((order: Order) =>
          order.items.some((item) =>
            sellerProds.some((product) => product._id === item.product._id)
          )
        );

        setOrders(sellerOrders);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // Filter orders based on search term and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.contactName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.overallStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOrderUpdate = (updatedOrder: Order) => {
    setOrders(
      orders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
      </div>

      <Card>
        <div className="p-6">
          <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center">
              <p className="text-lg font-medium text-gray-500">
                No orders found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    // Count only items that belong to this seller
                    const sellerItems = order.items.filter((item) =>
                      sellerProducts.some(
                        (product) => product._id === item.product._id
                      )
                    );

                    return (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">
                          {order._id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>{order.contactName}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{sellerItems.length}</TableCell>
                        <TableCell>
                          $
                          {sellerItems
                            .reduce((total, item) => {
                              const product = sellerProducts.find(
                                (p) => p._id === item.product._id
                              );
                              return total + (product?.price || 0);
                            }, 0)
                            .toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              order.overallStatus === "Completed"
                                ? "bg-green-100 text-green-800"
                                : order.overallStatus === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.overallStatus}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setDetailsModalOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      {selectedOrder && (
        <OrderDetailsModal
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          order={selectedOrder}
          sellerProducts={sellerProducts}
          onOrderUpdate={handleOrderUpdate}
        />
      )}
    </div>
  );
}
