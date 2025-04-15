"use client";
import { Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <div className="py-4 px-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.5 7.278C20.5 4.334 18.105 2 15.086 2C12.915 2 11.064 3.421 10.5 5.45C9.936 3.421 8.085 2 5.914 2C2.895 2 0.5 4.334 0.5 7.278C0.5 9.445 1.722 11.284 3.5 12.186V21C3.5 21.552 3.948 22 4.5 22H16.5C17.052 22 17.5 21.552 17.5 21V12.186C19.278 11.284 20.5 9.445 20.5 7.278Z"
            fill="currentColor"
          />
        </svg>
        <span className="font-display text-xl font-bold">Thrift Shop</span>
      </Link>

      <div className="hidden md:flex space-x-10">
        <Link
          href="/"
          className="font-medium hover:text-landa-green transition-colors"
        >
          HOME
        </Link>
        <Link
          href="/products"
          className="font-medium hover:text-landa-green transition-colors"
        >
          SHOP
        </Link>
        <Link
          href="/about"
          className="font-medium hover:text-landa-green transition-colors"
        >
          ABOUT
        </Link>
        <Link
          href="/contact"
          className="font-medium hover:text-landa-green transition-colors"
        >
          CONTACT
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pr-10 pl-4 py-2 rounded-full bg-landa-green/20 border-none focus:ring-landa-green focus:outline-none w-[200px] md:w-[250px]"
          />
          <Search
            className="absolute right-3 top-2.5 text-landa-green"
            size={18}
          />
        </div>

        {/* Cart Icon */}
        <Link
          href="/cart"
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ShoppingCart className="text-gray-700" size={22} />
          <span className="absolute -top-1 -right-1 bg-landa-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            0
          </span>
        </Link>

        {/* User Account */}
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center">
                <User className="text-gray-700" size={22} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="w-full cursor-pointer">
                  User Dashboard
                </Link>
              </DropdownMenuItem>
              {user?.role === "seller" && (
                <DropdownMenuItem asChild>
                  <Link
                    href="/seller-dashboard"
                    className="w-full cursor-pointer"
                  >
                    Seller Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/login"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <User className="text-gray-700" size={22} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
