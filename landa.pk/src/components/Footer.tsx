import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-landa-darkgreen text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-display text-2xl mb-4">Landa Thrift</h3>
            <p className="mb-4 text-gray-200">
              Sustainable fashion and vintage treasures since 1975. Curating
              unique pieces that tell stories and preserve the charm of the
              past.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-white text-landa-darkgreen rounded-full p-2 hover:bg-gray-200 transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="bg-white text-landa-darkgreen rounded-full p-2 hover:bg-gray-200 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="bg-white text-landa-darkgreen rounded-full p-2 hover:bg-gray-200 transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-landa-peach transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-landa-peach transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-landa-peach transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-landa-peach transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="hover:text-landa-peach transition-colors"
                >
                  Donate Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-xl mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 flex-shrink-0" size={18} />
                <span>123 Vintage Lane, Retro City, RC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} />
                <span>hello@landathrift.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-6 text-sm text-gray-300 text-center">
          <p>
            &copy; {new Date().getFullYear()} Landa Thrift Store. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
