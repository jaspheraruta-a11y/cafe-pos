import { House } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-coffee-100 text-coffee-700 mb-6">
            <House className="h-8 w-8" />
          </div>
          <h2 className="font-display text-3xl font-bold text-coffee-950 sm:text-4xl">About AJ&apos;s Café</h2>
          <p className="mt-4 text-lg text-coffee-700 leading-relaxed">
            We started with a simple idea: great coffee and food, made with care, available when you need it.
            Whether you order online for delivery, grab a quick takeaway, or sit in with a book, we’re here to make your day a little better.
          </p>
          <p className="mt-4 text-coffee-600">
            Use our website to browse the full menu, place orders, and track your delivery in real time. We also support walk-in and table service at our store.
          </p>
        </div>
      </div>
    </section>
  );
}
