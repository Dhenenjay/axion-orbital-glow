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
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InteractiveEarth } from "@/components/InteractiveEarth";
import FloodRiskMap from "@/components/FloodRiskMap";
import QueryProcessingOverlay from "@/components/QueryProcessingOverlay";

const Interface = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [hasSubmittedQuery, setHasSubmittedQuery] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mapType, setMapType] = useState<'flood' | 'crop'>('flood');
  const [currentProcessingQuery, setCurrentProcessingQuery] = useState("");

  // Sample queries for demonstration
  const sampleQueries = [
    "Build me a Crop Classification Model for Hoshiarpur for the Rabi Season of 2022-23",
    "Build me a Flood Risk Map for Jakarta for the extreme flood on 20 January 2020"
  ];

  // Handle state restoration when returning from DevMode
  useEffect(() => {
    if (location.state?.shouldShowOutput) {
      setShowOutput(true);
      setHasSubmittedQuery(location.state.hasSubmittedQuery || true);
      if (location.state.preservedQuery) {
        setQuery(location.state.preservedQuery);
      }
      if (location.state.preservedMapType) {
        setMapType(location.state.preservedMapType);
      }
      // Clear the location state to avoid issues on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const determineMapType = (queryText: string): 'flood' | 'crop' => {
    const lowerQuery = queryText.toLowerCase();
    if (lowerQuery.includes('crop') || 
        lowerQuery.includes('agriculture') || 
        lowerQuery.includes('farming') || 
        lowerQuery.includes('wheat') || 
        lowerQuery.includes('potato') || 
        lowerQuery.includes('plantation') ||
        lowerQuery.includes('classification') ||
        lowerQuery.includes('hoshiarpur') ||
        lowerQuery.includes('rabi')) {
      return 'crop';
    }
    return 'flood';
  };

  const handleSubmitQuery = () => {
    if (query.trim()) {
      const newMapType = determineMapType(query);
      setMapType(newMapType);
      setCurrentProcessingQuery(query);
      setIsProcessing(true);
      // Don't immediately show output - wait for processing to complete
    }
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    setShowOutput(true);
    setHasSubmittedQuery(true);
    // Map type is already set in handleSubmitQuery or handleMapQuerySubmit
  };

  const handleMapQuerySubmit = (mapQuery: string) => {
    // When query is submitted from the map overlay, start processing
    console.log('Map query submitted:', mapQuery);
    const newMapType = determineMapType(mapQuery);
    setMapType(newMapType);
    setCurrentProcessingQuery(mapQuery);
    setIsProcessing(true);
    // The processing overlay will show and then call handleProcessingComplete when done
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitQuery();
    }
  };

  const handleDevModeClick = () => {
    navigate('/dev-mode', { 
      state: { 
        hasSubmittedQuery,
        showOutput,
        query: query.trim() || (mapType === 'crop' ? "Crop classification analysis for Hoshiarpur district using Sentinel-2 data" : "Jakarta flood risk analysis with Sentinel-1 SAR data"),
        returnToOutput: showOutput,
        mapType: mapType
      } 
    });
  };

  const handleNavigateToCropClassification = () => {
    navigate('/crop-classification');
  };

  const handleSampleQueryClick = (sampleQuery: string) => {
    setQuery(sampleQuery);
  };

  const getPageTitle = () => {
    if (!showOutput) {
      return "No-Code IDE for Planetary Scale Satellite Data Analysis";
    }
    
    if (mapType === 'crop') {
      return "Live Crop Classification Analysis - Hoshiarpur District";
    }
    
    return "Live Flood Risk Analysis - Jakarta";
  };

  const getPageSubtitle = () => {
    if (!showOutput) {
      return "Harness the power of real-time satellite intelligence with natural language queries";
    }
    
    if (mapType === 'crop') {
      return "Multi-spectral crop classification using Sentinel-2 MSI data with interactive layers and detailed analytics";
    }
    
    return "Real-time flood risk mapping with interactive layers and detailed analytics";
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Processing Overlay */}
      <QueryProcessingOverlay 
        isProcessing={isProcessing}
        onComplete={handleProcessingComplete}
        query={currentProcessingQuery || (mapType === 'crop' ? "Crop classification analysis for Hoshiarpur district using Sentinel-2 data" : "Jakarta flood risk analysis with Sentinel-1 SAR data")}
      />

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
              onClick={handleDevModeClick}
              variant="outline"
              size="sm"
              className="bg-blue-500/20 border-blue-400/50 text-blue-300 hover:bg-blue-500/30 hover:text-blue-200 transition-all duration-300"
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

        {/* Main Content - Enhanced Scrollability */}
        <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
          {/* Enhanced Title */}
          <div className="px-8 py-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {getPageTitle()}
              </h1>
            </div>
            <p className="text-gray-400 text-sm mb-3">
              {getPageSubtitle()}
            </p>
            
            {/* Simulated Product UX Notice */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-amber-500/10 border border-amber-400/20 rounded-lg">
              <Info className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <p className="text-amber-200 text-sm">
                <strong>Note:</strong> This is a simulated product UX demonstration. Try one of the sample queries below to explore the interface.
              </p>
            </div>
          </div>

          {!showOutput ? (
            /* Main Content Area with Scroll */
            <ScrollArea className="flex-1">
              <div className="px-8 py-8">
                {/* Query Input */}
                <div className="mb-8">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                    <input
                      type="text"
                      placeholder="Build me a Crop Classification Model for Hoshiarpur for the Rabi Season of 2022-23"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl pl-12 pr-4 py-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:bg-slate-800/70 transition-all duration-300 text-lg"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>

                  {/* Sample Queries */}
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-400 mb-3">Try these sample queries:</p>
                    {sampleQueries.map((sampleQuery, index) => (
                      <button
                        key={index}
                        onClick={() => handleSampleQueryClick(sampleQuery)}
                        className="block w-full text-left px-4 py-3 bg-slate-800/30 hover:bg-slate-700/50 border border-slate-600/30 rounded-lg text-gray-300 hover:text-white transition-all duration-300 text-sm"
                      >
                        {sampleQuery}
                      </button>
                    ))}
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
                <div className="min-h-[600px]">
                  <div className="bg-slate-800/20 rounded-2xl border border-slate-700/30 h-full relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute top-4 left-6 z-10">
                      <h3 className="text-white font-semibold mb-1">Global Satellite Coverage</h3>
                      <p className="text-gray-400 text-sm">Interactive Earth Visualization</p>
                    </div>
                    
                    <div className="absolute top-4 right-6 z-10 space-y-2">
                      <div className="bg-slate-900/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-600/50">
                        <div className="text-cyan-400 text-sm font-semibold">Active Satellites</div>
                        <div className="text-white text-lg font-bold">2,847</div>
                      </div>
                      <div className="bg-slate-900/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-600/50">
                        <div className="text-blue-400 text-sm font-semibold">Data Points</div>
                        <div className="text-white text-lg font-bold">48.2M</div>
                      </div>
                    </div>

                    <div className="h-full flex items-center justify-center">
                      <InteractiveEarth />
                    </div>

                    <div className="absolute bottom-6 left-6 flex space-x-3">
                      <button className="p-3 bg-slate-800/70 hover:bg-slate-700/70 rounded-lg border border-slate-600/50 text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm">
                        <Globe className="w-5 h-5" />
                      </button>
                      <button className="p-3 bg-slate-800/70 hover:bg-slate-700/70 rounded-lg border border-slate-600/50 text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm">
                        <Satellite className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="absolute bottom-6 right-6 flex items-center space-x-2 bg-slate-900/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-600/50">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300 text-sm">Ready for analysis</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            /* Enhanced Output Display with Better Scrollability */
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="px-8 pb-8 pt-4">
                  {/* Map with enhanced interactivity */}
                  <div className="min-h-screen">
                    <FloodRiskMap 
                      mapType={mapType}
                      onQuerySubmit={handleMapQuerySubmit}
                    />
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interface;
