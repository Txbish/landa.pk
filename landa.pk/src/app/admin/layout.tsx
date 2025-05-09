"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  UserCheck,
  Users,
  Menu,
  X,
  Home,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoggedIn, loading } = useAuth();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if not admin (client-side protection)
  useEffect(() => {
    if (isMounted && !loading && (!isLoggedIn || user?.role !== "admin")) {
      window.location.href = "/";
    }
  }, [isMounted, loading, isLoggedIn, user]);

  if (!isMounted || loading || !isLoggedIn || user?.role !== "admin") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const navigation = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    {
      name: "Seller Requests",
      href: "/admin/seller-requests",
      icon: UserCheck,
    },
    { name: "Users", href: "/admin/users", icon: Users },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="absolute left-4 top-4 md:hidden">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Admin Panel</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <Separator />
            <nav className="flex-1 space-y-1 p-2">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-2 mt-auto">
              <Separator />
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                <Home className="mr-3 h-5 w-5" />
                Home
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden w-64 flex-shrink-0 border-r md:block">
        <div className="flex h-full flex-col">
          <div className="p-4">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </div>
          <Separator />
          <nav className="flex-1 space-y-1 p-2">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-2 mt-auto">
            <Separator />
            <Link
              href="/"
              className="mt-2 flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <Home className="mr-3 h-5 w-5" />
              Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
