"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { fetchUserOrders } from "@/services/orderService";
import { fetchProducts } from "@/services/productService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Order } from "@/lib/types";
export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        const ordersData = await fetchUserOrders();
        const productsData = await fetchProducts();

        // Filter products by seller
        const sellerProducts = productsData.products.filter(
          (product) => product.seller._id === user._id
        );

        // Filter orders that contain products from this seller
        const sellerOrders = ordersData.orders.filter((order: Order) =>
          order.items.some((item) =>
            sellerProducts.some((product) => product._id === item.product._id)
          )
        );

        const pendingOrders = sellerOrders.filter(
          (order: Order) => order.overallStatus === "Pending"
        );

        setStats({
          totalProducts: sellerProducts.length,
          totalOrders: sellerOrders.length,
          pendingOrders: pendingOrders.length,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      }
    };

    loadStats();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
      </div>

      {/* Seller Profile Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Seller Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-gray-500">Business Name</h3>
              <p className="text-lg font-semibold">
                {user?.sellerDetails?.businessName || "Not set"}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Total Earnings</h3>
              <p className="text-lg font-semibold">
                ${user?.sellerDetails?.earnings?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Products
                </p>
                <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-green-100 p-3">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Orders
                </p>
                <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-yellow-100 p-3">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Orders
                </p>
                <h3 className="text-2xl font-bold">{stats.pendingOrders}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/dashboard/products">
          <Card className="hover:bg-gray-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Manage Products</h3>
                  <p className="text-sm text-gray-500">
                    Add, edit, or remove your products
                  </p>
                </div>
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/orders">
          <Card className="hover:bg-gray-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Manage Orders</h3>
                  <p className="text-sm text-gray-500">
                    View and update order status
                  </p>
                </div>
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
