
import { Hero } from "@/components/Hero";
import { Partners } from "@/components/Partners";
import { Features } from "@/components/Features";
import { InteractiveDemo } from "@/components/InteractiveDemo";
import { UseCases } from "@/components/UseCases";
import { Technology } from "@/components/Technology";
import { Pricing } from "@/components/Pricing";
import { CTA } from "@/components/CTA";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      <Header />
      <Hero />
      <Partners />
      <InteractiveDemo />
      <Features />
      <UseCases />
      <Technology />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
