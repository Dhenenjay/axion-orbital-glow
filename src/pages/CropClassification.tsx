
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Code,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import FloodRiskMap from "@/components/FloodRiskMap";
import QueryProcessingOverlay from "@/components/QueryProcessingOverlay";

const CropClassification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("Crop classification analysis for Hoshiarpur district using Sentinel-2 data");
  const [showOutput, setShowOutput] = useState(true);
  const [hasSubmittedQuery, setHasSubmittedQuery] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingQuery, setCurrentProcessingQuery] = useState("");

  // Handle state restoration when returning from DevMode
  useEffect(() => {
    if (location.state?.shouldShowOutput !== undefined) {
      setShowOutput(location.state.shouldShowOutput);
      setHasSubmittedQuery(location.state.hasSubmittedQuery || true);
      if (location.state.preservedQuery) {
        setQuery(location.state.preservedQuery);
      }
      // Clear the location state to avoid issues on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmitQuery = () => {
    if (query.trim()) {
      setCurrentProcessingQuery(query);
      setIsProcessing(true);
    }
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    setShowOutput(true);
    setHasSubmittedQuery(true);
  };

  const handleMapQuerySubmit = (mapQuery: string) => {
    console.log('Crop map query submitted:', mapQuery);
    setCurrentProcessingQuery(mapQuery);
    setIsProcessing(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitQuery();
    }
  };

  const handleBackToInterface = () => {
    navigate('/interface');
  };

  const handleDevModeClick = () => {
    navigate('/dev-mode', { 
      state: { 
        hasSubmittedQuery: true,
        showOutput: true,
        query: query.trim(),
        returnToOutput: true
      } 
    });
  };

  return (
    <ScrollArea className="h-screen">
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-green-950 to-slate-950 relative overflow-hidden">
        {/* Processing Overlay */}
        <QueryProcessingOverlay 
          isProcessing={isProcessing}
          onComplete={handleProcessingComplete}
          query={currentProcessingQuery || "Crop classification analysis for Hoshiarpur district using Sentinel-2 data"}
        />

        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-400/30 rounded-full animate-twinkle"
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
                <Globe className="h-6 w-6 text-green-400 mr-2 animate-pulse" />
                <span className="text-xl font-bold text-white group-hover:text-green-300 transition-colors">
                  Phoenix 1.0 - Crop Classification
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleBackToInterface}
                variant="outline"
                size="sm"
                className="bg-green-500/20 border-green-400/50 text-green-300 hover:bg-green-500/30 hover:text-green-200 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Interface
              </Button>
              <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 rounded-full">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-300 text-sm font-medium">Live</span>
              </div>
              <User className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white transition-colors" />
              <Settings className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-73px)]">
          {/* Enhanced Sidebar */}
          <div className="w-20 bg-slate-900/50 border-r border-slate-700/50 flex flex-col items-center py-6 space-y-6 relative z-10">
            <div className="p-3 bg-green-500/20 rounded-xl border border-green-400/30 group hover:bg-green-500/30 transition-all duration-300">
              <BarChart3 className="h-6 w-6 text-green-400 group-hover:scale-110 transition-transform" />
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
            
            <div className="absolute left-0 top-6 w-1 h-12 bg-gradient-to-b from-green-400 to-emerald-500 rounded-r-full animate-pulse"></div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col relative z-10">
            {!showOutput ? (
              <>
                {/* Query Input Section */}
                <div className="px-8 py-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm">
                  <div className="flex items-center space-x-3 mb-2">
                    <Zap className="h-6 w-6 text-green-400 animate-pulse" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      Crop Classification Analysis
                    </h1>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Analyze agricultural areas using multi-spectral satellite data for precise crop identification
                  </p>
                </div>

                {/* Query Input */}
                <div className="px-8 py-8">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                    <input
                      type="text"
                      placeholder="Crop classification analysis for Hoshiarpur district using Sentinel-2 data"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl pl-12 pr-4 py-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:bg-slate-800/70 transition-all duration-300 text-lg"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  <div className="mt-6 flex items-center space-x-4">
                    <Button 
                      onClick={handleSubmitQuery}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
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
              </>
            ) : (
              <>
                {/* Crop Classification Title Section */}
                <div className="px-8 py-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm">
                  <div className="flex items-center space-x-3 mb-2">
                    <Zap className="h-6 w-6 text-green-400 animate-pulse" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      Live Crop Classification Analysis - Hoshiarpur District
                    </h1>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Multi-spectral crop classification using Sentinel-2 MSI data with interactive layers and detailed analytics
                  </p>
                </div>

                {/* Enhanced Output Display with ScrollArea */}
                <ScrollArea className="flex-1">
                  <div className="px-8 pb-8 pt-4">
                    {/* Crop Classification Map with enhanced interactivity */}
                    <div className="min-h-screen">
                      <FloodRiskMap 
                        mapType="crop"
                        onQuerySubmit={handleMapQuerySubmit}
                      />
                    </div>
                  </div>
                </ScrollArea>
              </>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default CropClassification;
