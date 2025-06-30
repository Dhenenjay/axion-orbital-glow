
import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Download, Share, Layers, Search, Zap, RotateCcw, Eye, EyeOff, Maximize2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface FloodRiskMapProps {
  mapType?: 'flood' | 'crop';
  onQuerySubmit?: (query: string) => void;
}

const FloodRiskMap = ({ mapType = 'flood', onQuerySubmit }: FloodRiskMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedLayer, setSelectedLayer] = useState('flood-depth');
  const [query, setQuery] = useState("Map flood risk in Jakarta, Indonesia");
  const [overlayPosition, setOverlayPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isMouseOverMap, setIsMouseOverMap] = useState(false);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const [isLayerVisible, setIsLayerVisible] = useState(true);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [imageFilter, setImageFilter] = useState('none');
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);

  // Update selected layer and query when map type changes
  useEffect(() => {
    if (mapType === 'crop') {
      setSelectedLayer('crop-types');
      setQuery("Analyze crop classification for Hoshiarpur district");
    } else {
      setSelectedLayer('flood-depth');
      setQuery("Map flood risk in Jakarta, Indonesia");
    }
  }, [mapType]);

  // Generate dynamic CSS filter based on controls
  const generateImageFilter = () => {
    return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) opacity(${layerOpacity}%)`;
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.3));
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setLayerOpacity(100);
  };

  const handleSubmitQuery = () => {
    console.log('Submitting query:', query);
    if (onQuerySubmit) {
      onQuerySubmit(query);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('map-image')) {
      setIsPanning(true);
      setPanStart({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y
      });
    } else {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - overlayPosition.x,
        y: e.clientY - overlayPosition.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanPosition({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    } else if (isDragging) {
      setOverlayPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPanning(false);
  };

  const handleMouseEnter = () => {
    setIsMouseOverMap(true);
  };

  const handleMouseLeave = () => {
    setIsMouseOverMap(false);
    setIsDragging(false);
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isMouseOverMap && e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel(prev => Math.max(0.3, Math.min(5, prev + delta)));
    }
  };

  const getMapImage = () => {
    if (mapType === 'crop') {
      return "/lovable-uploads/85ec5200-8f8e-4b38-aef3-e9424c659c2b.png";
    }
    return "/lovable-uploads/b19b4dc0-559c-488d-9b72-ca43ef69ae53.png";
  };

  const getMapTitle = () => {
    if (mapType === 'crop') {
      return "Crop Classification of Hoshiarpur - Rabi 2022-23";
    }
    return "Jakarta Flood Risk Analysis - SAR Data Results";
  };

  const handleLayerChange = (layerName: string) => {
    setSelectedLayer(layerName);
    // Add a subtle animation effect when switching layers
    setLayerOpacity(70);
    setTimeout(() => setLayerOpacity(100), 200);
  };

  return (
    <div className="flex flex-col space-y-6 w-full max-w-full overflow-hidden">
      {/* Enhanced header with real-time stats */}
      <div className="flex items-center justify-between p-4 bg-slate-900/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-sm font-medium">Live Analysis</span>
          </div>
          <div className="text-white font-semibold">{getMapTitle()}</div>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-600/30">
            <span className="text-gray-400">Resolution: </span>
            <span className="text-cyan-400 font-medium">10m</span>
          </div>
          <div className="bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-600/30">
            <span className="text-gray-400">Zoom: </span>
            <span className="text-cyan-400 font-medium">{Math.round(zoomLevel * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Main layout with enhanced controls */}
      <div className="flex w-full h-[700px] bg-slate-900/20 rounded-lg border border-slate-600/50 overflow-hidden">
        
        {/* Map Section with enhanced interactivity */}
        <div 
          className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden group"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
        >
          {/* Enhanced map container with smooth transitions */}
          <div 
            ref={mapContainer} 
            className="w-full h-full flex items-center justify-center overflow-hidden relative transition-all duration-300"
            style={{
              transform: `translate(${Math.max(-300, Math.min(300, panPosition.x))}px, ${Math.max(-300, Math.min(300, panPosition.y))}px)`
            }}
          >
            {/* Map image with enhanced filters and effects */}
            <img
              src={getMapImage()}
              alt={getMapTitle()}
              className="map-image w-full h-full object-contain transition-all duration-300 ease-out"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                filter: generateImageFilter(),
                maxWidth: '100%',
                maxHeight: '100%',
                opacity: isLayerVisible ? 1 : 0.3
              }}
              draggable={false}
            />

            {/* Dynamic overlay effects */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Grid overlay for GEE-like appearance */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}></div>
              
              {/* Scanning line effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-pulse"></div>
            </div>
          </div>

          {/* Enhanced draggable query overlay */}
          <div 
            className="absolute bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/90 backdrop-blur-xl rounded-xl p-4 border border-slate-600/50 shadow-2xl w-80 cursor-move z-50 transition-all duration-300 hover:shadow-cyan-500/10"
            style={{ 
              left: Math.max(10, Math.min(overlayPosition.x, window.innerWidth - 400)), 
              top: Math.max(10, Math.min(overlayPosition.y, 100)),
              userSelect: 'none'
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsDragging(true);
              setDragStart({
                x: e.clientX - overlayPosition.x,
                y: e.clientY - overlayPosition.y
              });
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <h4 className="text-white font-semibold text-sm">Active Query</h4>
              </div>
              <div className="text-xs text-gray-400">Drag to move</div>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-800/70 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm transition-all duration-200"
                placeholder="Enter your query..."
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleSubmitQuery();
              }}
              size="sm"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm w-full transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              <Zap className="w-4 h-4 mr-2" />
              Submit Query
            </Button>
          </div>
          
          {/* Enhanced zoom and pan controls */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl px-4 py-3 border border-gray-300 shadow-xl z-40 transition-all duration-300 hover:shadow-2xl">
            <div className="text-gray-700 text-xs font-semibold mb-1">
              Zoom: {Math.round(zoomLevel * 100)}%
            </div>
            <div className="text-gray-500 text-xs mb-2">
              Ctrl + Scroll to zoom
            </div>
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomIn}
                className="h-8 w-8 p-0 bg-white hover:bg-gray-50"
              >
                <ZoomIn className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomOut}
                className="h-8 w-8 p-0 bg-white hover:bg-gray-50"
              >
                <ZoomOut className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleResetView}
                className="h-8 w-8 p-0 bg-white hover:bg-gray-50"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {/* Enhanced action buttons */}
          <div className="absolute bottom-4 left-4 flex space-x-2 z-40">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/95 border-gray-300 text-gray-700 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/95 border-gray-300 text-gray-700 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAdvancedControls(!showAdvancedControls)}
              className="bg-white/95 border-gray-300 text-gray-700 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Settings className="w-4 h-4 mr-2" />
              Enhance
            </Button>
          </div>

          {/* Advanced image enhancement controls */}
          {showAdvancedControls && (
            <div className="absolute bottom-20 left-4 bg-white/95 backdrop-blur-md rounded-xl p-4 border border-gray-300 shadow-xl z-40 w-64 transition-all duration-300">
              <h5 className="text-gray-700 text-sm font-semibold mb-3">Image Enhancement</h5>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Brightness: {brightness}%</label>
                  <Slider
                    value={[brightness]}
                    onValueChange={(value) => setBrightness(value[0])}
                    max={200}
                    min={20}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Contrast: {contrast}%</label>
                  <Slider
                    value={[contrast]}
                    onValueChange={(value) => setContrast(value[0])}
                    max={200}
                    min={20}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Saturation: {saturation}%</label>
                  <Slider
                    value={[saturation]}
                    onValueChange={(value) => setSaturation(value[0])}
                    max={200}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Layer Opacity: {layerOpacity}%</label>
                  <Slider
                    value={[layerOpacity]}
                    onValueChange={(value) => setLayerOpacity(value[0])}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Coordinates display */}
          <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-600/50 z-40">
            <div className="text-green-400 text-xs font-mono">
              {mapType === 'crop' ? '30.8734°N, 75.9137°E' : '6.2088°S, 106.8456°E'}
            </div>
          </div>
        </div>

        {/* Enhanced Right Control Panel */}
        <div className="w-80 bg-slate-800/50 border-l border-slate-600/50 flex flex-col overflow-hidden">
          
          {/* Enhanced Map Controls */}
          <div className="p-4 border-b border-slate-600/50">
            <h4 className="text-white text-sm font-semibold mb-3 flex items-center">
              <Maximize2 className="w-4 h-4 mr-2" />
              Map Controls
            </h4>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Button
                onClick={handleZoomIn}
                size="sm"
                variant="outline"
                className="bg-white/95 border-gray-300 text-gray-700 hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
              >
                <ZoomIn className="w-4 h-4 mr-1" />
                Zoom In
              </Button>
              <Button
                onClick={handleZoomOut}
                size="sm"
                variant="outline"
                className="bg-white/95 border-gray-300 text-gray-700 hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
              >
                <ZoomOut className="w-4 h-4 mr-1" />
                Zoom Out
              </Button>
            </div>
            
            {/* Layer visibility toggle */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Layer Visibility</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsLayerVisible(!isLayerVisible)}
                className={`${isLayerVisible ? 'bg-green-500/20 border-green-400/50 text-green-300' : 'bg-gray-500/20 border-gray-400/50 text-gray-400'} transition-all duration-200`}
              >
                {isLayerVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Enhanced Layer Selector */}
          <div className="p-4 border-b border-slate-600/50">
            <h4 className="text-white text-sm font-semibold mb-3 flex items-center">
              <Layers className="w-4 h-4 mr-2" />
              {mapType === 'crop' ? 'Crop Analysis Layers' : 'SAR Analysis Layers'}
            </h4>
            <div className="space-y-2">
              {mapType === 'crop' ? (
                <>
                  <button
                    onClick={() => handleLayerChange('crop-types')}
                    className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all duration-200 border ${
                      selectedLayer === 'crop-types' 
                        ? 'bg-green-500/20 text-green-300 border-green-400/50 shadow-lg shadow-green-500/10' 
                        : 'text-gray-300 hover:bg-slate-700/50 border-slate-600/30 hover:border-slate-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Crop Classification</span>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleLayerChange('agricultural')}
                    className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all duration-200 border ${
                      selectedLayer === 'agricultural' 
                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50 shadow-lg shadow-yellow-500/10' 
                        : 'text-gray-300 hover:bg-slate-700/50 border-slate-600/30 hover:border-slate-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Agricultural Zones</span>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleLayerChange('ndvi')}
                    className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all duration-200 border ${
                      selectedLayer === 'ndvi' 
                        ? 'bg-blue-500/20 text-blue-300 border-blue-400/50 shadow-lg shadow-blue-500/10' 
                        : 'text-gray-300 hover:bg-slate-700/50 border-slate-600/30 hover:border-slate-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>NDVI Analysis</span>
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleLayerChange('flood-depth')}
                    className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all duration-200 border ${
                      selectedLayer === 'flood-depth' 
                        ? 'bg-blue-500/20 text-blue-300 border-blue-400/50 shadow-lg shadow-blue-500/10' 
                        : 'text-gray-300 hover:bg-slate-700/50 border-slate-600/30 hover:border-slate-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Flood Detection</span>
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleLayerChange('economic')}
                    className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all duration-200 border ${
                      selectedLayer === 'economic' 
                        ? 'bg-orange-500/20 text-orange-300 border-orange-400/50 shadow-lg shadow-orange-500/10' 
                        : 'text-gray-300 hover:bg-slate-700/50 border-slate-600/30 hover:border-slate-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>SAR Backscatter</span>
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Enhanced Data Info with real-time stats */}
          <div className="p-4 border-b border-slate-600/50">
            <h4 className="text-white text-sm font-semibold mb-2 flex items-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
              {mapType === 'crop' ? 'Sentinel-2 Analysis' : 'Sentinel-1 SAR Analysis'}
            </h4>
            <p className="text-gray-400 text-xs mb-3">
              {mapType === 'crop' ? 'Hoshiarpur District, Punjab, India' : 'Jakarta Metropolitan Area, Indonesia'}
            </p>
            <div className="space-y-2 text-xs">
              {mapType === 'crop' ? (
                <>
                  <div className="flex justify-between p-2 bg-slate-900/30 rounded">
                    <span className="text-gray-400">Sensor:</span>
                    <span className="text-green-400 font-medium">Sentinel-2 MSI</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-900/30 rounded">
                    <span className="text-gray-400">Season:</span>
                    <span className="text-green-400 font-medium">Rabi 2022-23</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-900/30 rounded">
                    <span className="text-gray-400">Resolution:</span>
                    <span className="text-green-400 font-medium">10m × 10m</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-900/30 rounded">
                    <span className="text-gray-400">Accuracy:</span>
                    <span className="text-green-400 font-medium">87.3%</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-900/30 rounded">
                    <span className="text-gray-400">Last Updated:</span>
                    <span className="text-cyan-400 font-medium">2 min ago</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between p-2 bg-slate-900/30 rounded">
                    <span className="text-gray-400">Sensor:</span>
                    <span className="text-blue-400 font-medium">Sentinel-1 C-band</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-900/30 rounded">
                    <span className="text-gray-400">Polarization:</span>
                    <span className="text-blue-400 font-medium">VV/VH</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-900/30 rounded">
                    <span className="text-gray-400">Resolution:</span>
                    <span className="text-blue-400 font-medium">10m × 10m</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-900/30 rounded">
                    <span className="text-gray-400">Accuracy:</span>
                    <span className="text-green-400 font-medium">92.1%</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-900/30 rounded">
                    <span className="text-gray-400">Last Updated:</span>
                    <span className="text-cyan-400 font-medium">Live</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Enhanced Legend with interactive elements */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h4 className="text-white text-sm font-semibold mb-3 flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              {mapType === 'crop' ? 'Classification Legend' : 
               selectedLayer === 'flood-depth' ? 'Flood Detection Legend' : 'Backscatter Legend'}
            </h4>
            <div className="space-y-3">
              {mapType === 'crop' ? (
                <>
                  <div className="flex items-center justify-between p-2 bg-slate-900/20 rounded-lg border border-slate-700/30 hover:bg-slate-900/30 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-600 rounded border shadow-sm"></div>
                      <span className="text-gray-300 text-xs">Plantation</span>
                    </div>
                    <span className="text-green-400 text-xs font-medium">34.2%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-900/20 rounded-lg border border-slate-700/30 hover:bg-slate-900/30 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-purple-600 rounded border shadow-sm"></div>
                      <span className="text-gray-300 text-xs">Wheat</span>
                    </div>
                    <span className="text-purple-400 text-xs font-medium">28.7%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-900/20 rounded-lg border border-slate-700/30 hover:bg-slate-900/30 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow-400 rounded border shadow-sm"></div>
                      <span className="text-gray-300 text-xs">Potato</span>
                    </div>
                    <span className="text-yellow-400 text-xs font-medium">18.9%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-900/20 rounded-lg border border-slate-700/30 hover:bg-slate-900/30 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-600 rounded border shadow-sm"></div>
                      <span className="text-gray-300 text-xs">Other crops</span>
                    </div>
                    <span className="text-red-400 text-xs font-medium">12.1%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-900/20 rounded-lg border border-slate-700/30 hover:bg-slate-900/30 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-400 rounded border shadow-sm"></div>
                      <span className="text-gray-300 text-xs">Water bodies</span>
                    </div>
                    <span className="text-blue-400 text-xs font-medium">4.3%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-900/20 rounded-lg border border-slate-700/30 hover:bg-slate-900/30 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-amber-800 rounded border shadow-sm"></div>
                      <span className="text-gray-300 text-xs">Urban/Fallow</span>
                    </div>
                    <span className="text-amber-400 text-xs font-medium">1.8%</span>
                  </div>
                </>
              ) : selectedLayer === 'flood-depth' ? (
                <>
                  <div className="flex items-center justify-between p-2 bg-slate-900/20 rounded-lg border border-slate-700/30 hover:bg-slate-900/30 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-600 rounded border shadow-sm"></div>
                      <span className="text-gray-300 text-xs">Flooded Areas</span>
                    </div>
                    <span className="text-red-400 text-xs font-medium">23.4 km²</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-900/20 rounded-lg border border-slate-700/30 hover:bg-slate-900/30 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-400 rounded border shadow-sm"></div>
                      <span className="text-gray-300 text-xs">Water Bodies</span>
                    </div>
                    <span className="text-blue-400 text-xs font-medium">8.7 km²</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-900/20 rounded-lg border border-slate-700/30 hover:bg-slate-900/30 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-white rounded border border-gray-400 shadow-sm"></div>
                      <span className="text-gray-300 text-xs">Dry Areas</span>
                    </div>
                    <span className="text-gray-400 text-xs font-medium">145.2 km²</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-900/20 rounded-lg border border-slate-700/30 hover:bg-slate-900/30 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow-400 rounded border shadow-sm"></div>
                      <span className="text-gray-300 text-xs">Urban Areas</span>
                    </div>
                    <span className="text-yellow-400 text-xs font-medium">67.1 km²</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between p-2 bg-slate-900/20 rounded-lg border border-slate-700/30 hover:bg-slate-900/30 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-600 rounded border shadow-sm"></div>
                      <span className="text-gray-300 text-xs">High (-5 to 0 dB)</span>
                    </div>
                    <span className="text-red-400 text-xs font-medium">High Intensity</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-900/20 rounded-lg border border-slate-700/30 hover:bg-slate-900/30 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-orange-500 rounded border shadow-sm"></div>
                      <span className="text-gray-300 text-xs">Medium (-10 to -5 dB)</span>
                    </div>
                    <span className="text-orange-400 text-xs font-medium">Med Intensity</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-900/20 rounded-lg border border-slate-700/30 hover:bg-slate-900/30 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow-400 rounded border shadow-sm"></div>
                      <span className="text-gray-300 text-xs">Low (-15 to -10 dB)</span>
                    </div>
                    <span className="text-yellow-400 text-xs font-medium">Low Intensity</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-900/20 rounded-lg border border-slate-700/30 hover:bg-slate-900/30 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-400 rounded border shadow-sm"></div>
                      <span className="text-gray-300 text-xs">V.Low (-20 to -15 dB)</span>
                    </div>
                    <span className="text-blue-400 text-xs font-medium">Very Low</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Methodology Section */}
      <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/30 to-slate-900/40 backdrop-blur-sm rounded-lg border border-slate-600/50 p-6 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mr-3 animate-pulse"></div>
            Advanced Methodology & Processing Pipeline
          </h3>
          <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
            {mapType === 'crop' ? (
              <>
                <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-700/30">
                  <strong className="text-green-400">Multi-spectral Classification:</strong> Advanced Sentinel-2 MSI analysis utilizing 10m resolution imagery 
                  for precise crop identification during Rabi season 2022-23. Supervised Random Forest classification algorithms 
                  with feature engineering for optimal crop discrimination.
                </div>
                <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-700/30">
                  <strong className="text-blue-400">Temporal Phenology Analysis:</strong> Time-series analysis incorporating NDVI, NDWI, and custom 
                  spectral indices to capture crop growth patterns, flowering stages, and harvest timing for accurate 
                  classification of wheat, potato, and plantation crops.
                </div>
                <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-700/30">
                  <strong className="text-purple-400">Validation & Accuracy:</strong> Ground truth validation using agricultural survey data and 
                  field verification achieving 87.3% overall accuracy with class-specific accuracies: Wheat (94%), 
                  Plantation (91%), Potato (84%).
                </div>
              </>
            ) : (
              <>
                <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-700/30">
                  <strong className="text-blue-400">SAR Flood Detection:</strong> Multi-temporal Sentinel-1 C-band SAR analysis using VV/VH polarizations. 
                  Advanced backscatter change detection algorithms identifying significant signal reductions indicating 
                  standing water and flood extent mapping.
                </div>
                <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-700/30">
                  <strong className="text-cyan-400">Change Detection Pipeline:</strong> Pre-flood and post-flood image comparison using statistical 
                  thresholding and machine learning classification. Integration with DEM data for flood depth estimation 
                  and flow direction analysis.
                </div>
                <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-700/30">
                  <strong className="text-orange-400">Real-time Monitoring:</strong> Automated processing chain with 92.1% accuracy validation against 
                  ground truth data and optical imagery cross-validation for rapid disaster response and impact assessment.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloodRiskMap;
