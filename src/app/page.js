// src/app/page.js
import Navbar from "@/components/Navbar";
import HeroIntro from "@/components/HeroIntro";
import About from "@/components/About";
import BrandStory from "@/components/BrandStory";
import AppSection from "@/components/AppSection";
import VideoFeedback from "@/components/video";
// import SkinType from "@/components/SkinType";
import ProductShowcase from "@/components/ProductShowcase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#1C1C1A]">
      <Navbar />
      <HeroIntro />
      <section
        aria-label="NO TWO introduction video"
        className="relative h-screen h-[100svh] w-full overflow-hidden bg-black"
      >
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/intro.mp4" type="video/mp4" />
        </video>
      </section>
      {/* <SkinType /> */}
      <About />
      <BrandStory />
      <AppSection />
      <VideoFeedback />
      <ProductShowcase />
      <Footer />
    </main>
  );
}
