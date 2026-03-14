import { Mail, Phone, MessageCircle } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-coffee-950 sm:text-4xl">Get in touch</h2>
          <p className="mt-3 text-coffee-600">We’d love to hear from you.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a href="mailto:hello@brewandco.ph" className="flex items-center gap-3 text-coffee-700 hover:text-coffee-900 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coffee-100">
              <Mail className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-medium text-coffee-900">Email</p>
              <p className="text-sm">hello@brewandco.ph</p>
            </div>
          </a>
          <a href="tel:+63281234567" className="flex items-center gap-3 text-coffee-700 hover:text-coffee-900 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coffee-100">
              <Phone className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-medium text-coffee-900">Phone</p>
              <p className="text-sm">+63 2 8123 4567</p>
            </div>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-coffee-700 hover:text-coffee-900 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coffee-100">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-medium text-coffee-900">Social</p>
              <p className="text-sm">Facebook · Instagram</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
