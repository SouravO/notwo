import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#EAECEF]">
      <Navbar />
      <Contact />
      <Footer light />
    </main>
  );
}
