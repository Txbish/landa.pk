import { Facebook, Instagram, Twitter } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative flex flex-col md:flex-row items-center overflow-hidden rounded-xl">
      {/* Left Side - Image */}
      <div className="md:w-1/2 relative z-10 p-4 md:p-6">
        <div className="rounded-xl overflow-hidden shadow-xl border-4 border-white">
          <img
            src="/lovable-uploads/b4818da8-9aff-4496-90a5-e60be7bdf550.png"
            alt="Person shopping at thrift store"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="md:w-1/2 relative z-10 p-6 md:p-10">
        <h1 className="retro-headline text-4xl md:text-6xl lg:text-7xl leading-tight mb-6">
          Save Money,
          <br />
          Look Great
        </h1>

        <p className="text-lg mb-4 font-medium">Open Daily : 9 a.m to 8 p.m</p>

        <div className="mb-6">
          <span className="inline-block bg-landa-green text-white font-bold text-2xl py-3 px-8 rounded-md">
            50% OFF
          </span>
        </div>

        <p className="mb-8 text-gray-700 max-w-md">
          Discover unique vintage treasures and sustainable fashion at Landa.
          Quality second-hand clothing and accessories that help you express
          your style while being kind to your wallet and the planet.
        </p>

        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <a
            href="#"
            className="bg-black rounded-full p-2 text-white hover:opacity-80 transition-opacity"
          >
            <Twitter size={20} />
          </a>
          <a
            href="#"
            className="bg-black rounded-full p-2 text-white hover:opacity-80 transition-opacity"
          >
            <Facebook size={20} />
          </a>
          <a
            href="#"
            className="bg-black rounded-full p-2 text-white hover:opacity-80 transition-opacity"
          >
            <Instagram size={20} />
          </a>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-5 right-5 text-landa-green animate-pulse">
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L14.2451 8.90983H21.5106L15.6327 13.1803L17.8779 20.0902L12 15.82L6.12215 20.0902L8.36729 13.1803L2.48944 8.90983H9.75486L12 2Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="absolute bottom-10 right-20 text-landa-green">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 18.6C15.5899 18.6 18.6 15.5899 18.6 12C18.6 8.41015 15.5899 5.4 12 5.4C8.41015 5.4 5.4 8.41015 5.4 12C5.4 15.5899 8.41015 18.6 12 18.6Z"
            fill="#FF7F3F"
          />
          <path
            d="M12 22C7 22 3 17 3 12C3 7 7 2 12 2C17 2 21 7 21 12C21 17 17 22 12 22ZM12 20C16 20 19 16.5 19 12C19 7.5 16 4 12 4C8 4 5 7.5 5 12C5 16.5 8 20 12 20Z"
            fill="currentColor"
          />
          <path
            d="M12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16Z"
            fill="#5A8B69"
          />
        </svg>
      </div>

      <div className="absolute bottom-20 right-60 text-landa-green rotate-12">
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612C17.0401 3.26375 18.1425 3.99665 19.0711 4.92893C19.9997 5.86121 20.7326 6.96355 21.2351 8.17678C21.7377 9.39001 21.9963 10.6904 21.9963 12.0037C21.9963 14.6583 20.9423 17.2028 19.0711 19.0711C17.1999 20.9393 14.6546 21.99 12 21.99C10.6867 21.99 9.38634 21.7313 8.17311 21.2288C6.95988 20.7262 5.85754 19.9933 4.92893 19.0711C3.05928 17.1986 2.01019 14.6526 2.01019 12.0037C2.01019 9.35472 3.05928 6.80872 4.92893 4.93618C6.79858 3.06364 9.34529 2.01975 12 2.01975"
            stroke="#5A8B69"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 7V17"
            stroke="#5A8B69"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 12H17"
            stroke="#5A8B69"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
