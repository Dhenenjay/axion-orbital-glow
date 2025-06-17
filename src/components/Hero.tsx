
import { ArrowRight, Globe, Zap, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrbitingElements } from "@/components/OrbitingElements";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/10 to-slate-950/20"></div>
      
      {/* Orbiting Elements */}
      <OrbitingElements />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-8">
            <Zap className="h-4 w-4 text-cyan-400 mr-2" />
            <span className="text-cyan-400 text-sm font-medium">No-Code Satellite Data Analysis</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Planetary Scale
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Satellite Data
            </span>
            <span className="block">Analysis IDE</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Unlock the power of satellite imagery with our revolutionary no-code platform. 
            Analyze planetary-scale data, detect changes, and generate insights without writing a single line of code.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 text-lg group">
              Start Building
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg">
              Watch Demo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-gray-300">
              <Globe className="h-5 w-5 text-cyan-400" />
              <span>Global Coverage</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-300">
              <Database className="h-5 w-5 text-cyan-400" />
              <span>Petabyte Scale</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-300">
              <Zap className="h-5 w-5 text-cyan-400" />
              <span>Real-time Processing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
