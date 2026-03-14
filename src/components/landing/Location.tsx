"use client";

export function Location() {
  return (
    <section id="location" className="py-20 bg-cream-100/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-coffee-950 sm:text-4xl">Find us</h2>
          <p className="mt-3 text-coffee-600">Visit our cafe or order for delivery.</p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-coffee-200 shadow-lg bg-white max-w-4xl mx-auto">
          <iframe
            title="Store location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.833836072752!2d125.1797977!3d7.8905457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAJ&apos;s%20Cafe!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
          <div className="p-4 bg-white border-t border-coffee-100">
            <p className="font-medium text-coffee-900">AJ&apos;s Cafe</p>
            <p className="text-sm text-coffee-600">Location coordinates: 7.8905457, 125.1797977</p>
            <p className="text-sm text-coffee-600">Open: Mon–Sun 7:00 AM – 9:00 PM</p>
          </div>
        </div>
      </div>
    </section>
  );
}
