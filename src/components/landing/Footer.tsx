import Link from "next/link";
import { House } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-coffee-200 bg-coffee-950 text-cream-200">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-cream-50">
            <House className="h-5 w-5 text-coffee-400" />
            AJ&apos;s Café
          </Link>
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/#menu" className="hover:text-cream-50 transition">Menu</Link>
            <Link href="/#about" className="hover:text-cream-50 transition">About</Link>
            <Link href="/#location" className="hover:text-cream-50 transition">Location</Link>
            <Link href="/#contact" className="hover:text-cream-50 transition">Contact</Link>
            <Link href="/login" className="hover:text-cream-50 transition">Log in</Link>
            <Link href="/order" className="hover:text-cream-50 transition">Order</Link>
          </nav>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-cream-400 hover:text-cream-50 transition" aria-label="Facebook">FB</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-cream-400 hover:text-cream-50 transition" aria-label="Instagram">IG</a>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-coffee-400">© {new Date().getFullYear()} AJ&apos;s Café. All rights reserved.</p>
      </div>
    </footer>
  );
}
