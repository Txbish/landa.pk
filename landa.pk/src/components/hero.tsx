import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative">
      {/* Hero background */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div
        className="relative h-[70vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
        }}
      >
        <div className="container px-4 relative z-20 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6">
              Redefine Your Style
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto">
              Explore our latest collection of premium clothing designed for the
              modern individual
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="text-lg px-8">
                  Shop Now
                </Button>
              </Link>
              <Link href="/collections/new">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 bg-transparent text-white border-white hover:bg-white hover:text-black"
                >
                  New Arrivals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
