import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
          <Image
            src="/placeholder.svg"
            alt="Landa Logo"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">About Landa</h1>
        <p className="text-lg text-gray-700">
          <span className="font-semibold">Landa</span> is an online thrift store
          and marketplace founded at the start of this semester by Tabish Noman
          Khan, Aoun Jee, and Hasnain Ali Arshad. Our mission is to make fashion
          more sustainable, affordable, and accessible for everyone.
        </p>
        <p className="text-gray-600">
          We provide a platform for anyone to buy, sell, or thrift quality
          second-hand fashion items and clothes. Whether you want to refresh
          your wardrobe or give your pre-loved clothes a new home, Landa is the
          place for you!
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">What makes us different?</span> Landa
          is built by students, for students and the wider community. We focus
          on trust, ease of use, and a vibrant local marketplace. Our platform
          is designed to make thrifting fun, safe, and rewarding for everyone.
        </p>
        <div className="flex flex-col items-center gap-2 mt-6">
          <Link href="/products">
            <button className="bg-landa-green hover:bg-landa-darkgreen text-white font-semibold px-6 py-2 rounded transition">
              Shop Now
            </button>
          </Link>
          <Link href="/contact">
            <button className="bg-white border border-landa-green text-landa-green font-semibold px-6 py-2 rounded mt-2">
              Contact Us
            </button>
          </Link>
        </div>
        <div className="w-full border-t my-8"></div>
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-xl font-semibold mb-1">Contact & Location</h2>
          <p className="text-gray-700">
            Email:{" "}
            <a href="mailto:info@landa.pk" className="underline">
              info@landa.pk
            </a>
          </p>
          <p className="text-gray-700">Location: Islamabad, Pakistan</p>
        </div>
        <div className="mt-8 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Landa. All rights reserved.
        </div>
      </div>
    </main>
  );
}
