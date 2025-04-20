"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home, User, ShoppingBag, Store } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Sidebar className="w-64">
      {" "}
      {/* Adjusted width for the sidebar */}
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user?.profileImage || "/placeholder.svg"}
              alt={user?.name}
            />
            <AvatarFallback>
              {user?.name ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user?.name}</span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={
                pathname === "/dashboard" ||
                pathname === "/dashboard/personal-info"
              }
            >
              <Link href="/dashboard/personal-info">
                <User className="h-4 w-4" />
                <span>Personal Info</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard/my-orders"}
            >
              <Link href="/dashboard/my-orders">
                <ShoppingBag className="h-4 w-4" />
                <span>My Orders</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user?.role === "user" && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/dashboard/seller-request"}
              >
                <Link href="/dashboard/seller-request">
                  <Store className="h-4 w-4" />
                  <span>Seller Request</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <Link href="/">
          <Button variant="outline" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}

function DashboardNavbar() {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />
      <div className="ml-auto flex items-center gap-4">
        {/* Add any additional navbar items here */}
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-1 min-h-screen">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardNavbar />
          <main className="flex-1 p-6 mx-auto"> {children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
