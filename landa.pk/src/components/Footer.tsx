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
            <h3 className="font-display text-2xl mb-4">Landa</h3>
            <p className="mb-4 text-gray-200">
              Landa is an online thrift store and marketplace founded by Tabish
              Noman Khan, Aoun Jee, and Hasnain Ali Arshad. Our mission is to
              make fashion more sustainable, affordable, and accessible for
              everyone.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-white text-landa-darkgreen rounded-full p-2 hover:bg-gray-200 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="bg-white text-landa-darkgreen rounded-full p-2 hover:bg-gray-200 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="bg-white text-landa-darkgreen rounded-full p-2 hover:bg-gray-200 transition-colors"
                aria-label="Instagram"
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
                  href="/products"
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
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-xl mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 flex-shrink-0" size={18} />
                <span>Islamabad, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} />
                <span>
                  <a href="mailto:info@landa.pk" className="underline">
                    info@landa.pk
                  </a>
                </span>
              </li>
            </ul>
            <div className="mt-4 text-xs text-gray-300">
              Members: Tabish Noman Khan, Aoun Jee, Hasnain Ali Arshad
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-6 text-sm text-gray-300 text-center">
          <p>&copy; {new Date().getFullYear()} Landa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
