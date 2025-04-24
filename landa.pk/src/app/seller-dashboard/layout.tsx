"use client";

import type React from "react";

import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isLoggedIn } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (!loading && (!isLoggedIn || user?.role !== "seller")) {
      redirect("/login");
    }
  }, [loading, isLoggedIn, user]);

  if (!isClient) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isLoggedIn || user?.role !== "seller") {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
