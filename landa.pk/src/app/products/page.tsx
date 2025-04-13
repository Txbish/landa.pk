import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "All Products | Elegance",
  description: "Browse our complete collection of modern fashion and clothing",
};

// Mock product data based on the provided schema
const products = [
  {
    _id: "1",
    title: "Premium Cotton T-Shirt",
    description: "Soft, breathable cotton t-shirt perfect for everyday wear",
    price: 29.99,
    category: "T-Shirts",
    image: "/placeholder.svg?height=400&width=300",
    isAvailable: true,
  },
  {
    _id: "2",
    title: "Slim Fit Jeans",
    description: "Classic slim fit jeans with a modern touch",
    price: 59.99,
    category: "Jeans",
    image: "/placeholder.svg?height=400&width=300",
    isAvailable: true,
  },
  {
    _id: "3",
    title: "Casual Linen Shirt",
    description: "Lightweight linen shirt for a casual yet sophisticated look",
    price: 45.99,
    category: "Shirts",
    image: "/placeholder.svg?height=400&width=300",
    isAvailable: true,
  },
  {
    _id: "4",
    title: "Wool Blend Sweater",
    description: "Warm and comfortable wool blend sweater for colder days",
    price: 79.99,
    category: "Sweaters",
    image: "/placeholder.svg?height=400&width=300",
    isAvailable: true,
  },
  {
    _id: "5",
    title: "Designer Jacket",
    description: "Stylish designer jacket to elevate your outfit",
    price: 129.99,
    category: "Jackets",
    image: "/placeholder.svg?height=400&width=300",
    isAvailable: true,
  },
  {
    _id: "6",
    title: "Graphic Print T-Shirt",
    description: "Bold graphic print t-shirt for a statement look",
    price: 34.99,
    category: "T-Shirts",
    image: "/placeholder.svg?height=400&width=300",
    isAvailable: true,
  },
  {
    _id: "7",
    title: "Relaxed Fit Chinos",
    description: "Comfortable relaxed fit chinos for a casual look",
    price: 49.99,
    category: "Pants",
    image: "/placeholder.svg?height=400&width=300",
    isAvailable: true,
  },
  {
    _id: "8",
    title: "Formal Dress Shirt",
    description: "Elegant formal dress shirt for special occasions",
    price: 65.99,
    category: "Shirts",
    image: "/placeholder.svg?height=400&width=300",
    isAvailable: true,
  },
  {
    _id: "9",
    title: "Knit Cardigan",
    description: "Cozy knit cardigan for layering in cooler weather",
    price: 69.99,
    category: "Sweaters",
    image: "/placeholder.svg?height=400&width=300",
    isAvailable: true,
  },
  {
    _id: "10",
    title: "Leather Bomber Jacket",
    description: "Classic leather bomber jacket for a timeless look",
    price: 199.99,
    category: "Jackets",
    image: "/placeholder.svg?height=400&width=300",
    isAvailable: true,
  },
  {
    _id: "11",
    title: "Striped Polo Shirt",
    description: "Classic striped polo shirt for a smart casual look",
    price: 39.99,
    category: "T-Shirts",
    image: "/placeholder.svg?height=400&width=300",
    isAvailable: true,
  },
  {
    _id: "12",
    title: "Distressed Denim Jeans",
    description: "Trendy distressed denim jeans for an edgy look",
    price: 69.99,
    category: "Jeans",
    image: "/placeholder.svg?height=400&width=300",
    isAvailable: true,
  },
];

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              All Products
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Browse our complete collection of premium clothing and
              accessories.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant="outline" className="rounded-full">
              All
            </Button>
            <Button variant="outline" className="rounded-full">
              T-Shirts
            </Button>
            <Button variant="outline" className="rounded-full">
              Jeans
            </Button>
            <Button variant="outline" className="rounded-full">
              Shirts
            </Button>
            <Button variant="outline" className="rounded-full">
              Sweaters
            </Button>
            <Button variant="outline" className="rounded-full">
              Jackets
            </Button>
            <Button variant="outline" className="rounded-full">
              Pants
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                href={`/products/${product._id}`}
                key={product._id}
                className="block"
              >
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                    />
                    {product.category && (
                      <Badge className="absolute top-3 left-3 z-10">
                        {product.category}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-2 font-semibold">
                      ${product.price.toFixed(2)}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="secondary" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
