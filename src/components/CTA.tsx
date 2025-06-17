import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
export const CTA = () => {
  return <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/20 via-blue-950/20 to-purple-950/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-8">
            <Sparkles className="h-4 w-4 text-cyan-400 mr-2" />
            <span className="text-cyan-400 text-sm font-medium">Start Your Journey Today</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Unlock
            <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Planetary Intelligence?
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Join hundreds of devs & organizations already using Axion Orbital to transform satellite data into actionable insights.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 text-lg group">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-purple-400/50 text-white px-8 py-3 text-lg">
              Schedule Demo
            </Button>
          </div>
          
          <p className="text-gray-400 text-sm mt-6">
            No credit card required • 14-day free trial • Enterprise support available
          </p>
        </div>
      </div>
    </section>;
};