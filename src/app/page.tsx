import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import AISection from "@/components/AISection";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-primary min-h-screen">
      <Navbar />
      <main>
        <Hero />

        {/* Visual divider */}
        <div
          aria-hidden="true"
          className="mx-auto max-w-6xl px-6"
        >
          <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" style={{ borderColor: "hsl(var(--border))", background: "linear-gradient(to right, transparent, hsl(var(--border)), transparent)", height: "1px" }} />
        </div>

        <Features />

        <div
          aria-hidden="true"
          className="mx-auto max-w-6xl px-6"
        >
          <div style={{ background: "linear-gradient(to right, transparent, hsl(var(--border)), transparent)", height: "1px" }} />
        </div>

        <AISection />

        <CTA />
      </main>
      <Footer />
    </div>
  );
}

