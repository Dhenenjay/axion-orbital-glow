
import { useState } from "react";
import { Menu, X, Satellite } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-blue-900/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Satellite className="h-8 w-8 text-cyan-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-2xl font-bold text-white">Axion Orbital</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a>
            <a href="#use-cases" className="text-gray-300 hover:text-cyan-400 transition-colors">Use Cases</a>
            <a href="#technology" className="text-gray-300 hover:text-cyan-400 transition-colors">Technology</a>
            <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950">
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-blue-900/20">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a>
              <a href="#use-cases" className="text-gray-300 hover:text-cyan-400 transition-colors">Use Cases</a>
              <a href="#technology" className="text-gray-300 hover:text-cyan-400 transition-colors">Technology</a>
              <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 w-fit">
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
