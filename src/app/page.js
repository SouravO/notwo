// src/app/page.js
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import SkinType from "@/components/SkinType";
import Services from "@/components/Services";
import Model from "@/components/model";
import ProductShowcase from "@/components/ProductShowcase";
import Cards from "@/components/Cards";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#08090b]">
      <Navbar />
      <Hero />
      <About />
      <SkinType />
      <Services />
      <Model />
      <ProductShowcase />
      <Cards />
      <Contact />
      <Footer />
    </main>
  );
}