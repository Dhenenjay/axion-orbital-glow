import { useState } from "react";
import { 
  Globe, 
  Menu, 
  Database, 
  BarChart3, 
  Settings, 
  MessageCircle,
  User,
  Search,
  Zap,
  Satellite,
  Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InteractiveEarth } from "@/components/InteractiveEarth";
import FloodRiskMap from "@/components/FloodRiskMap";

const Interface = () => {
  const [query, setQuery] = useState("");
  const [devMode, setDevMode] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleSubmitQuery = () => {
    if (query.trim()) {
      setShowOutput(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitQuery();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-md relative z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Menu className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white transition-colors" />
            <div className="flex items-center group">
              <Globe className="h-6 w-6 text-cyan-400 mr-2 animate-pulse" />
              <span className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                Phoenix 1.0
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-300 text-sm font-medium">Live</span>
            </div>
            <Button
              onClick={() => setDevMode(!devMode)}
              variant="outline"
              size="sm"
              className={`transition-all duration-300 ${
                devMode 
                  ? 'bg-orange-500/20 border-orange-400/50 text-orange-300 hover:bg-orange-500/30' 
                  : 'bg-blue-500/20 border-blue-400/50 text-blue-300 hover:bg-blue-500/30 hover:text-blue-200'
              }`}
            >
              <Code className="h-4 w-4 mr-2" />
              Dev Mode
            </Button>
            <User className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white transition-colors" />
            <Settings className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Enhanced Sidebar */}
        <div className="w-20 bg-slate-900/50 border-r border-slate-700/50 flex flex-col items-center py-6 space-y-6 relative z-10">
          <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-400/30 group hover:bg-cyan-500/30 transition-all duration-300">
            <BarChart3 className="h-6 w-6 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="p-3 hover:bg-slate-700/50 rounded-xl cursor-pointer group transition-all duration-300">
            <Database className="h-6 w-6 text-gray-400 group-hover:text-white group-hover:scale-110 transition-all" />
          </div>
          <div className="p-3 hover:bg-slate-700/50 rounded-xl cursor-pointer group transition-all duration-300">
            <Satellite className="h-6 w-6 text-gray-400 group-hover:text-white group-hover:scale-110 transition-all" />
          </div>
          <div className="p-3 hover:bg-slate-700/50 rounded-xl cursor-pointer group transition-all duration-300">
            <MessageCircle className="h-6 w-6 text-gray-400 group-hover:text-white group-hover:scale-110 transition-all" />
          </div>
          
          <div className="absolute left-0 top-6 w-1 h-12 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full animate-pulse"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative z-10">
          {/* Enhanced Title */}
          <div className="px-8 py-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {showOutput ? "Live Flood Risk Analysis - Jakarta" : "No-Code IDE for Planetary Scale Satellite Data Analysis"}
              </h1>
            </div>
            <p className="text-gray-400 text-sm">
              {showOutput ? "Real-time flood risk mapping with interactive layers and detailed analytics" : "Harness the power of real-time satellite intelligence with natural language queries"}
            </p>
          </div>

          {!showOutput ? (
            <>
              {/* Query Input */}
              <div className="px-8 py-8">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Give me the raw Sentinel-2 multispectral data for Jalandhar from 25th November 2023 to 30th January 2024"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl pl-12 pr-4 py-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:bg-slate-800/70 transition-all duration-300 text-lg"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <div className="mt-6 flex items-center space-x-4">
                  <Button 
                    onClick={handleSubmitQuery}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Submit Query
                  </Button>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Real-time processing ready</span>
                  </div>
                </div>
              </div>

              {/* Interactive Earth Visualization */}
              <div className="flex-1 px-8 pb-8">
                <div className="bg-slate-800/20 rounded-2xl border border-slate-700/30 h-full relative overflow-hidden backdrop-blur-sm">
                  {/* Header for the visualization */}
                  <div className="absolute top-4 left-6 z-10">
                    <h3 className="text-white font-semibold mb-1">Global Satellite Coverage</h3>
                    <p className="text-gray-400 text-sm">Interactive Earth Visualization</p>
                  </div>
                  
                  {/* Stats overlay */}
                  <div className="absolute top-4 right-6 z-10 space-y-2">
                    <div className="bg-slate-900/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-600/50">
                      <div className="text-cyan-400 text-sm font-semibold">Active Satellites</div>
                      <div className="text-white text-lg font-bold">2,847</div>
                    </div>
                    <div className="bg-slate-900/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-600/50">
                      <div className="text-blue-400 text-sm font-semibold">Data Points</div>
                      <div className="text-white text-lg font-bold">48.2M</div>
                    </div>
                    {devMode && (
                      <div className="bg-orange-900/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-orange-400/50">
                        <div className="text-orange-300 text-sm font-semibold">Dev Mode</div>
                        <div className="text-orange-100 text-xs">Debug: Active</div>
                      </div>
                    )}
                  </div>

                  {/* Interactive Earth Component */}
                  <div className="h-full flex items-center justify-center">
                    <InteractiveEarth />
                  </div>

                  {/* Floating action buttons */}
                  <div className="absolute bottom-6 left-6 flex space-x-3">
                    <button className="p-3 bg-slate-800/70 hover:bg-slate-700/70 rounded-lg border border-slate-600/50 text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm">
                      <Globe className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-slate-800/70 hover:bg-slate-700/70 rounded-lg border border-slate-600/50 text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm">
                      <Satellite className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Processing indicator */}
                  <div className="absolute bottom-6 right-6 flex items-center space-x-2 bg-slate-900/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-600/50">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300 text-sm">Ready for analysis</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Enhanced Output Display */
            <div className="flex-1 px-8 pb-8 pt-4">
              {/* Flood Risk Map with enhanced interactivity */}
              <div className="h-full">
                <FloodRiskMap />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interface;
