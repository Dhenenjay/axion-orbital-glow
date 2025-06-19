import { ArrowRight, Globe, Zap, Database, Users, Earth, HardDrive, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Simplified Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/10 to-slate-950/20"></div>
      
      {/* Subtle moving stars - reduced count */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Simplified Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-8">
              <Zap className="h-4 w-4 text-cyan-400 mr-2" />
              <span className="text-cyan-400 text-sm font-medium">No-Code Satellite Data Analysis</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Access and analyze
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                satellite data
              </span>
              <span className="block">without writing code</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              AxionOrbital is a no-code IDE for planetary-scale satellite data that enables geospatial developers to quickly download imagery, detect changes, and generate new insights without writing a single line of code.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 text-lg group transform hover:scale-105 transition-all duration-200"
                onClick={() => navigate('/signup')}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-orange-400/50 text-white px-8 py-3 text-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSeOyi8U2DOuTBeqc_f8_4cGDzFrTkmoAxx54IEINz2NDDoCFA/viewform', '_blank')}
              >
                <Users className="mr-2 h-5 w-5" />
                Priority Waitlist
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer">
                <Earth className="h-5 w-5 text-cyan-400" />
                <span>Global Coverage</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer">
                <HardDrive className="h-5 w-5 text-cyan-400" />
                <span>Petabytes of Data</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer">
                <Zap className="h-5 w-5 text-cyan-400" />
                <span>Real Time</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer">
                <Clock className="h-5 w-5 text-cyan-400" />
                <span>Up to 10x faster</span>
              </div>
            </div>
          </div>

          {/* Right side - YouTube Video with subtle effects */}
          <div className="relative">
            <div className="relative group">
              {/* Subtle glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-15 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative">
                <YouTubeEmbed
                  videoId="LouUEF38ezk"
                  autoplay={true}
                  muted={true}
                  loop={true}
                  playbackRate={1.2}
                  startTime={139}
                  className="aspect-video shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
