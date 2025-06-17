
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { UseCases } from "@/components/UseCases";
import { Technology } from "@/components/Technology";
import { CTA } from "@/components/CTA";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      <Header />
      <Hero />
      <Features />
      <UseCases />
      <Technology />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
