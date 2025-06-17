
import { ArrowRight, Globe, Zap, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrbitingElements } from "@/components/OrbitingElements";
import { FloatingElements } from "@/components/FloatingElements";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/10 to-slate-950/20"></div>
      
      {/* Orbiting Elements */}
      <OrbitingElements />
      
      {/* Floating Interactive Elements */}
      <FloatingElements />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-8 animate-pulse">
              <Zap className="h-4 w-4 text-cyan-400 mr-2" />
              <span className="text-cyan-400 text-sm font-medium">No-Code Satellite Data Analysis</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
              Planetary Scale
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                Satellite Data
              </span>
              <span className="block">Analysis IDE</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Unlock the power of satellite imagery with our revolutionary no-code platform. 
              Analyze planetary-scale data, detect changes, and generate insights without writing a single line of code.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 text-lg group transform hover:scale-105 transition-all duration-200">
                Start Building
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-purple-400/50 text-white px-8 py-3 text-lg transform hover:scale-105 transition-all duration-200">
                Watch Demo
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer">
                <Globe className="h-5 w-5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
                <span>Global Coverage</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer">
                <Database className="h-5 w-5 text-cyan-400 animate-pulse" />
                <span>Petabyte Scale</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer">
                <Zap className="h-5 w-5 text-cyan-400 animate-bounce" />
                <span>Real-time Processing</span>
              </div>
            </div>
          </div>

          {/* Right side - YouTube Video */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="relative group">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative">
                <YouTubeEmbed
                  videoId="LouUEF38ezk"
                  autoplay={true}
                  muted={true}
                  loop={true}
                  className="aspect-video shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Floating UI elements around video */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
