import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-cream-100 via-cream-50 to-coffee-100">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ac876e\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
      <div className="container relative mx-auto px-4 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-coffee-600 animate-fade-in">
          Fresh roasted · Handcrafted
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-coffee-950 sm:text-5xl md:text-6xl lg:text-7xl animate-slide-up">
          Your daily dose of
          <span className="block text-coffee-600">good coffee</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-coffee-700 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Order online for pickup or delivery. Specialty coffee, milk teas, pastries, and meals — all in one place.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Button size="lg" className="gap-2" asChild>
            <Link href="/order">
              Order Now <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/#menu">View Menu</Link>
          </Button>
        </div>
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-coffee-600">
          <span>☕ Espresso · Americano · Latte</span>
          <span>🧋 Milk Tea · Wintermelon</span>
          <span>🥐 Pastries · Meals</span>
        </div>
      </div>
    </section>
  );
}
