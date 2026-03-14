"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { House } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-coffee-200/60 bg-cream-50/95 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold text-coffee-800">
          <House className="h-7 w-7 text-coffee-600" />
          AJ&apos;s Café
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-coffee-700">
          <Link href="/#menu" className="hover:text-coffee-900 transition">Menu</Link>
          <Link href="/#about" className="hover:text-coffee-900 transition">About</Link>
          <Link href="/#reviews" className="hover:text-coffee-900 transition">Reviews</Link>
          <Link href="/#location" className="hover:text-coffee-900 transition">Location</Link>
          <Link href="/#contact" className="hover:text-coffee-900 transition">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/order">Order Now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
