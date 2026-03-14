import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";

export function Promos() {
  return (
    <section className="py-20 bg-coffee-800 text-cream-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-50/20">
              <Tag className="h-7 w-7" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">Promos & discounts</h2>
              <p className="text-cream-200 mt-1">Use code <strong>WELCOME10</strong> for 10% off your first order (min. ₱200).</p>
            </div>
          </div>
          <Button variant="secondary" size="lg" className="bg-cream-50 text-coffee-900 hover:bg-cream-100" asChild>
            <Link href="/order">Order now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
