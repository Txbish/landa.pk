import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ProductsSection from "@/components/ProductSection";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-landa-cream">
      <div className="container mx-auto px-4">
        <Navbar />

        {/* Wavy Background Container */}
        <div className="bg-landa-peach rounded-xl p-3 md:p-6 mt-6 shadow-lg relative overflow-hidden">
          {/* Wavy borders */}
          <div className="absolute -left-4 top-1/3 bottom-0 w-12">
            <svg
              viewBox="0 0 20 80"
              preserveAspectRatio="none"
              className="h-full w-full fill-landa-green"
            >
              <path d="M20,0 C10,10 0,20 0,40 C0,60 10,70 20,80 L20,0 Z" />
            </svg>
          </div>
          <div className="absolute -right-4 top-0 bottom-1/3 w-12">
            <svg
              viewBox="0 0 20 80"
              preserveAspectRatio="none"
              className="h-full w-full fill-landa-green"
            >
              <path d="M0,0 C10,10 20,20 20,40 C20,60 10,70 0,80 L0,0 Z" />
            </svg>
          </div>

          <HeroSection />
        </div>

        {/* Features Section */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-landa-peach w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-3.5-6H14a.5.5 0 1 0 0-1h-4a2.5 2.5 0 1 1 0-5h1V7h2v1h2.5v2H10a.5.5 0 1 0 0 1h4a2.5 2.5 0 0 1 0 5h-1v1h-2v-1H8.5v-2z"
                  fill="#5A8B69"
                />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              Affordable Prices
            </h3>
            <p className="text-gray-600">
              Quality pieces at prices that won't break the bank.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-landa-peach w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.8 5.3C20.5 4.9 20.1 4.8 19.7 4.8H7.2L7 4.1C6.9 3.7 6.5 3.4 6.1 3.4H3.8C3.3 3.4 3 3.8 3 4.3C3 4.8 3.4 5.1 3.8 5.1H5.4L8.4 15.2C8.2 15.5 8.1 15.8 8.1 16.2C8.1 17 8.8 17.7 9.6 17.7C10.4 17.7 11.1 17 11.1 16.2C11.1 15.9 11 15.6 10.8 15.3H16.2C16 15.6 15.9 15.9 15.9 16.2C15.9 17 16.6 17.7 17.4 17.7C18.2 17.7 18.9 17 18.9 16.2C18.9 15.9 18.8 15.6 18.6 15.3H18.7C19.2 15.3 19.5 14.9 19.5 14.4C19.5 13.9 19.1 13.6 18.7 13.6H9.6L9.2 12.2H18.3C18.7 12.2 19.1 11.9 19.2 11.5L21.1 6C21.2 5.6 21 5.6 20.8 5.3ZM17.8 10.5H8.7L7.7 7H19.1L17.8 10.5Z"
                  fill="#5A8B69"
                />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              Unique Selection
            </h3>
            <p className="text-gray-600">
              One-of-a-kind vintage pieces you won't find anywhere else.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-landa-peach w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.9999 22V20C9.9999 20 8.99994 19 8.32994 17H3.99994C3.44994 17 2.99994 16.55 2.99994 16V5C2.99994 4.45 3.44994 4 3.99994 4H19.9999C20.5499 4 20.9999 4.45 20.9999 5V16C20.9999 16.55 20.5499 17 19.9999 17H15.6699C14.9999 19 13.9999 20 10.9999 20V22H12.9999ZM4.99994 14H5.99994V15H18.9999V14H19.9999V6H4.99994V14ZM8.99994 11.97C9.94994 11.97 10.7199 11.2 10.7199 10.25C10.7199 9.3 9.94994 8.53 8.99994 8.53C8.04994 8.53 7.27994 9.3 7.27994 10.25C7.27994 11.2 8.04994 11.97 8.99994 11.97ZM14.9999 11.97C15.9499 11.97 16.7199 11.2 16.7199 10.25C16.7199 9.3 15.9499 8.53 14.9999 8.53C14.0499 8.53 13.2799 9.3 13.2799 10.25C13.2799 11.2 14.0499 11.97 14.9999 11.97Z"
                  fill="#5A8B69"
                />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              Eco-Friendly
            </h3>
            <p className="text-gray-600">
              Shop sustainably and reduce fashion waste with pre-loved items.
            </p>
          </div>
        </div>

        <ProductsSection />

        {/* Newsletter Section */}
        <div className="py-16">
          <div className="bg-landa-green rounded-xl p-8 text-center text-white">
            <h2 className="font-display text-3xl font-bold mb-2">
              Join Our Groovy Newsletter
            </h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Be the first to know about new arrivals, special collections, and
              exclusive offers!
            </p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow p-3 rounded-l-md text-black focus:outline-none"
              />
              <button className="bg-landa-orange hover:bg-landa-peach text-white font-bold px-6 rounded-r-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
