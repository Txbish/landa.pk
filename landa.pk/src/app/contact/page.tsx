import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center gap-6">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-700 text-lg">
          Have a question, suggestion, or want to get in touch? We’d love to
          hear from you!
        </p>
        <div className="w-full flex flex-col gap-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold mb-1">Email</h2>
            <a
              href="mailto:info@landa.pk"
              className="text-landa-green underline"
            >
              info@landa.pk
            </a>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold mb-1">Location</h2>
            <p className="text-gray-700">Islamabad, Pakistan</p>
          </div>
        </div>
        <div className="w-full border-t my-8"></div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-600">Or reach out to us on social media:</p>
          <div className="flex gap-4 justify-center">
            <a
              href="#"
              className="text-landa-green hover:underline"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-landa-green hover:underline"
              aria-label="Facebook"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-landa-green hover:underline"
              aria-label="Twitter"
            >
              Twitter
            </a>
          </div>
        </div>
        <Link href="/products">
          <button className="mt-8 bg-landa-green hover:bg-landa-darkgreen text-white font-semibold px-6 py-2 rounded transition">
            Shop Now
          </button>
        </Link>
      </div>
    </main>
  );
}
