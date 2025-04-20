import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
      <p className="text-muted-foreground mb-8">
        We couldn't find the product you're looking for.
      </p>
      <Button asChild>
        <Link href="/products">Browse All Products</Link>
      </Button>
    </div>
  );
}
