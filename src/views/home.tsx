'use client';

import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { MenuPreview } from "@/components/landing/MenuPreview";
import { Testimonials } from "@/components/landing/Testimonials";
import { About } from "@/components/landing/About";
import { Location } from "@/components/landing/Location";
import { Contact } from "@/components/landing/Contact";
import { Promos } from "@/components/landing/Promos";
import { Footer } from "@/components/landing/Footer";

export default function HomeView() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MenuPreview />
        <Testimonials />
        <About />
        <Location />
        <Contact />
        <Promos />
      </main>
      <Footer />
    </>
  );
}
