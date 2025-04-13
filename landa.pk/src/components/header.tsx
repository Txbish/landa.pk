"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/" className="text-lg font-medium">
                Home
              </Link>
              <Link href="/products" className="text-lg font-medium">
                Shop All
              </Link>
              <Link href="/collections/new" className="text-lg font-medium">
                New Arrivals
              </Link>
              <Link
                href="/collections/bestsellers"
                className="text-lg font-medium"
              >
                Bestsellers
              </Link>
              <Link href="/collections/sale" className="text-lg font-medium">
                Sale
              </Link>
              <Link href="/about" className="text-lg font-medium">
                About
              </Link>
              <Link href="/contact" className="text-lg font-medium">
                Contact
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2 md:w-1/3">
          <Link href="/" className="font-bold text-xl md:text-2xl">
            ELEGANCE
          </Link>
        </div>

        <nav className="mx-auto hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Shop All
          </Link>
          <Link
            href="/collections/new"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            New Arrivals
          </Link>
          <Link
            href="/collections/bestsellers"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Bestsellers
          </Link>
          <Link
            href="/collections/sale"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Sale
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-4 md:w-1/3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            {isSearchOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingBag className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
        </div>
      </div>

      {isSearchOpen && (
        <div className="border-t py-4 px-4 container">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search for products..."
              className="w-full rounded-md border border-input pl-10 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>
      )}
    </header>
  );
}
