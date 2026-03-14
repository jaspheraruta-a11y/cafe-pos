import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { House, Milk, Croissant, Utensils, CupSoda, Cookie, Flame } from "lucide-react";

const categories = [
  { name: "MILKTEA", slug: "coffee", icon: CupSoda, desc: "Classic and flavored milk teas" },
  { name: "FRAPPE", slug: "milk-tea", icon: House, desc: "Blended iced coffee drinks" },
  { name: "SNACKS", slug: "pastries", icon: Cookie, desc: "Light bites and pastries" },
  { name: "SIZZLING FOR BARKADA", slug: "meals", icon: Flame, desc: "Hot meals perfect for groups" },
];

export function MenuPreview() {
  return (
    <section id="menu" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-bold text-coffee-950 sm:text-4xl">Our Menu</h2>
          <p className="mt-3 text-coffee-600 max-w-2xl mx-auto">Something for every mood — from classic espresso to seasonal specials.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.slug} href={`/order?category=${cat.slug}`}>
                <Card className="h-full transition-all hover:shadow-lg hover:border-coffee-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-coffee-100 text-coffee-700">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold text-coffee-900">{cat.name}</h3>
                    <p className="mt-1 text-sm text-coffee-600">{cat.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/order">View full menu & order</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
