"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Home } from "lucide-react";

export function Sidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  const links = [
    { href: "/seller-dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/seller-dashboard/products", label: "Products", icon: Package },
    { href: "/seller-dashboard/orders", label: "Orders", icon: ShoppingBag },
  ];

  return (
    <div className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white md:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-gray-900">Seller Hub</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <link.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive
                      ? "text-gray-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-200 p-4">
          <Link href="/">
            <button className="flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <Home className="mr-3 h-5 w-5 text-gray-400" />
              Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
