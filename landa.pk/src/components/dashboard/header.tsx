"use client";

import { useAuth } from "@/context/AuthContext";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "./sidebar";

export function Header() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center md:hidden">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium text-gray-700">
              {user?.name}
            </span>
            <div className="relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium uppercase text-gray-600">
                {user?.name?.charAt(0) || "S"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative flex h-full w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-shrink-0 px-4">
              <span className="text-xl font-bold">Seller Hub</span>
            </div>
            <div className="mt-5 h-0 flex-1 overflow-y-auto">
              <Sidebar />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
