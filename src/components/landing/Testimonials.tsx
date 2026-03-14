import { Card, CardContent } from "@/components/ui/card";

const reviews = [
  {
    name: "Maria S.",
    text: "Best latte in town. I order through the app every morning — fast and always perfect.",
    rating: 5,
  },
  {
    name: "James L.",
    text: "The online ordering is so smooth. I track my order in real time. Highly recommend!",
    rating: 5,
  },
  {
    name: "Ana R.",
    text: "Love the pastries and the delivery option. AJ&apos;s Café is my go-to cafe.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="reviews" className="py-20 bg-cream-100/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-bold text-coffee-950 sm:text-4xl">What people say</h2>
          <p className="mt-3 text-coffee-600 max-w-2xl mx-auto">Real reviews from our customers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <Card key={r.name} className="bg-white">
              <CardContent className="p-6">
                <div className="flex gap-1 text-amber-500 mb-3">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-coffee-700">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-4 font-medium text-coffee-800">— {r.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
