// src/app/page.js
import Navbar from "@/components/Navbar";
import HeroIntro from "@/components/HeroIntro";
import About from "@/components/About";
import AppSection from "@/components/AppSection";
import VideoFeedback from "@/components/video";
import SkinType from "@/components/SkinType";
import ProductShowcase from "@/components/ProductShowcase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#08090b]">
      <Navbar />
      <HeroIntro />
      <SkinType />
      <About />
      <AppSection />
      <VideoFeedback />
      <ProductShowcase />
      <Footer />
    </main>
  );
}
