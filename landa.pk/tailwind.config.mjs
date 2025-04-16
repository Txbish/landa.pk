/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", "dark"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  plugins: {
    "@tailwindcss/postcss": {},
    "@tailwindcss/animate": {},
  },
};
