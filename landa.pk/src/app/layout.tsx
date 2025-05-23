import type React from "react";
import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { Toaster } from "sonner";
import { Cart } from "@/components/cart/Cart";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Landa | Online Thrift Store",
  description: "Discover unique thrifted fashion pieces at Landa.pk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster position="bottom-right" richColors duration={4000} />
              <Cart />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
