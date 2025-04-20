import { Product } from "@/lib/types";
import { Badge } from "./ui/badge";
import Image from "next/image";
import Link from "next/link"; // Import Link

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      href={`/products/${product._id}`}
      className="block group rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">SOLD OUT</span>
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-landa-green text-white">
          {product.category}
        </Badge>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold text-landa-orange">
            ${product.price.toFixed(2)}
          </span>
          <button
            disabled={!product.isAvailable}
            className={`px-3 py-1.5 rounded ${
              product.isAvailable
                ? "bg-landa-green text-white hover:bg-landa-darkgreen"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            } transition-colors`}
            onClick={(e) => e.preventDefault()} // Prevent navigation on button click
          >
            {product.isAvailable ? "Add to Cart" : "Sold Out"}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
