
import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Download, Share, Layers, Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleSubmitQuery = () => {
    console.log('Submitting query:', query);
    if (onQuerySubmit) {
      onQuerySubmit(query);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('map-image')) {
      // Start panning
      setIsPanning(true);
      setPanStart({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y
      });
    } else {
      // Start dragging overlay
      setIsDragging(true);
      setDragStart({
        x: e.clientX - overlayPosition.x,
        y: e.clientX - overlayPosition.y
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
    // Only handle zoom if mouse is over the map AND user is holding Ctrl key
    if (isMouseOverMap && e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
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

  return (
    <div className="flex flex-col space-y-6 w-full max-w-full overflow-hidden">
      {/* Main layout with left map and right controls */}
      <div className="flex w-full h-[600px] bg-slate-900/20 rounded-lg border border-slate-600/50 overflow-hidden">
        
        {/* Map Section - Takes up most of the space */}
        <div 
          className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
        >
          {/* Map image container */}
          <div 
            ref={mapContainer} 
            className="w-full h-full flex items-center justify-center overflow-hidden relative"
            style={{
              transform: `translate(${Math.max(-200, Math.min(200, panPosition.x))}px, ${Math.max(-200, Math.min(200, panPosition.y))}px)`
            }}
          >
            <img
              src={getMapImage()}
              alt={getMapTitle()}
              className="map-image w-full h-full object-contain transition-transform duration-200 ease-out"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                maxWidth: '100%',
                maxHeight: '100%'
              }}
              draggable={false}
            />
          </div>

          {/* Draggable Query Overlay - Positioned within map area */}
          <div 
            className="absolute bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md rounded-xl p-4 border border-slate-600/50 shadow-xl w-72 cursor-move z-50"
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
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <h4 className="text-white font-semibold text-sm">Active Query</h4>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
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
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              Submit Query
            </Button>
          </div>
          
          {/* Zoom level indicator - Top left of map */}
          <div className="absolute top-4 left-4 bg-white/97 backdrop-blur-md rounded-lg px-3 py-2 border border-gray-300 shadow-lg z-40">
            <div className="text-gray-700 text-xs font-semibold">
              Zoom: {Math.round(zoomLevel * 100)}%
            </div>
            <div className="text-gray-500 text-xs mt-1">
              Hold Ctrl + scroll to zoom
            </div>
          </div>
          
          {/* Action buttons - Bottom left of map */}
          <div className="absolute bottom-4 left-4 flex space-x-2 z-40">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/95 border-gray-300 text-gray-700 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/95 border-gray-300 text-gray-700 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Right Control Panel - Fixed width, stays within bounds */}
        <div className="w-80 bg-slate-800/50 border-l border-slate-600/50 flex flex-col overflow-hidden">
          
          {/* Zoom Controls */}
          <div className="p-4 border-b border-slate-600/50">
            <h4 className="text-white text-sm font-semibold mb-3">Map Controls</h4>
            <div className="flex space-x-2">
              <Button
                onClick={handleZoomIn}
                size="sm"
                variant="outline"
                className="bg-white/95 border-gray-300 text-gray-700 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 flex-1 flex items-center justify-center"
              >
                <ZoomIn className="w-4 h-4 mr-2" />
                Zoom In
              </Button>
              <Button
                onClick={handleZoomOut}
                size="sm"
                variant="outline"
                className="bg-white/95 border-gray-300 text-gray-700 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 flex-1 flex items-center justify-center"
              >
                <ZoomOut className="w-4 h-4 mr-2" />
                Zoom Out
              </Button>
            </div>
          </div>

          {/* Layer Selector */}
          <div className="p-4 border-b border-slate-600/50">
            <h4 className="text-white text-sm font-semibold mb-3 flex items-center">
              <Layers className="w-4 h-4 mr-2" />
              {mapType === 'crop' ? 'Crop Analysis' : 'SAR Analysis'}
            </h4>
            <div className="space-y-2">
              {mapType === 'crop' ? (
                <>
                  <button
                    onClick={() => setSelectedLayer('crop-types')}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                      selectedLayer === 'crop-types' 
                        ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                        : 'text-gray-300 hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    Crop Types
                  </button>
                  <button
                    onClick={() => setSelectedLayer('agricultural')}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                      selectedLayer === 'agricultural' 
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' 
                        : 'text-gray-300 hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    Agricultural Areas
                  </button>
                  <button
                    onClick={() => setSelectedLayer('ndvi')}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                      selectedLayer === 'ndvi' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' 
                        : 'text-gray-300 hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    NDVI Analysis
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedLayer('flood-depth')}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                      selectedLayer === 'flood-depth' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' 
                        : 'text-gray-300 hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    Flood Extent
                  </button>
                  <button
                    onClick={() => setSelectedLayer('economic')}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                      selectedLayer === 'economic' 
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-400/30' 
                        : 'text-gray-300 hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    SAR Backscatter
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Data Info */}
          <div className="p-4 border-b border-slate-600/50">
            <h4 className="text-white text-sm font-semibold mb-2">
              {mapType === 'crop' ? 'Sentinel-2 Crop Classification' : 'Sentinel-1 SAR Analysis'}
            </h4>
            <p className="text-gray-400 text-xs mb-3">
              {mapType === 'crop' ? 'Hoshiarpur District, Punjab' : 'Jakarta Metropolitan Area'}
            </p>
            <div className="space-y-1 text-xs text-gray-300">
              {mapType === 'crop' ? (
                <>
                  <div className="flex justify-between">
                    <span>Sensor:</span>
                    <span className="text-green-400 font-medium">Sentinel-2 MSI</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Season:</span>
                    <span className="text-green-400 font-medium">Rabi 2022-23</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolution:</span>
                    <span className="text-green-400 font-medium">10m × 10m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bands Used:</span>
                    <span className="text-green-400 font-medium">B2,B3,B4,B8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <span className="text-green-400 font-medium">RF Classification</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span className="text-green-400 font-medium">87.3%</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>Sensor:</span>
                    <span className="text-blue-400">Sentinel-1 C-band</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Polarization:</span>
                    <span className="text-blue-400">VV/VH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolution:</span>
                    <span className="text-blue-400">10m × 10m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <span className="text-green-400">Multi-temporal</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Legend - Scrollable if needed */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h4 className="text-white text-sm font-semibold mb-3">
              {mapType === 'crop' ? 'Crop Classification Legend' : 
               selectedLayer === 'flood-depth' ? 'Flood Detection (SAR)' : 'Backscatter Intensity (dB)'}
            </h4>
            <div className="space-y-2">
              {mapType === 'crop' ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-600 rounded border"></div>
                    <span className="text-gray-300 text-xs">Plantation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-purple-600 rounded border"></div>
                    <span className="text-gray-300 text-xs">Wheat</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-400 rounded border"></div>
                    <span className="text-gray-300 text-xs">Potato</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-600 rounded border"></div>
                    <span className="text-gray-300 text-xs">Other crops</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-400 rounded border"></div>
                    <span className="text-gray-300 text-xs">Water</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-amber-800 rounded border"></div>
                    <span className="text-gray-300 text-xs">Urban and Fallow</span>
                  </div>
                </>
              ) : selectedLayer === 'flood-depth' ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-600 rounded border"></div>
                    <span className="text-gray-300 text-xs">Flooded Areas</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-400 rounded border"></div>
                    <span className="text-gray-300 text-xs">Water Bodies</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-white rounded border border-gray-400"></div>
                    <span className="text-gray-300 text-xs">Non-flooded Areas</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-400 rounded border"></div>
                    <span className="text-gray-300 text-xs">Urban Areas</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-600 rounded border"></div>
                    <span className="text-gray-300 text-xs">High (-5 to 0)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-orange-500 rounded border"></div>
                    <span className="text-gray-300 text-xs">Medium (-10 to -5)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-400 rounded border"></div>
                    <span className="text-gray-300 text-xs">Low (-15 to -10)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-400 rounded border"></div>
                    <span className="text-gray-300 text-xs">Very Low (-20 to -15)</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Methodology Section */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-600/50 p-6">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
          <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
          Methodology
        </h3>
        <div className="text-gray-300 space-y-2 text-sm leading-relaxed">
          {mapType === 'crop' ? (
            <>
              <p>
                <strong>Multi-spectral Crop Classification:</strong> Sentinel-2 MSI data with 10m resolution used for 
                precise crop type identification during Rabi season 2022-23 using supervised Random Forest algorithms.
              </p>
              <p>
                <strong>Temporal Analysis:</strong> Time-series analysis of NDVI, NDWI, and spectral indices to capture 
                crop phenology and distinguish between different crop types based on their growth patterns and spectral signatures.
              </p>
              <p>
                <strong>Ground Truth Validation:</strong> Field survey data and agricultural records used for training 
                and validation, achieving 87.3% overall classification accuracy with highest accuracy for wheat (94%) and plantation crops (91%).
              </p>
              <p>
                <strong>Preprocessing:</strong> Atmospheric correction using Sen2Cor, cloud masking, and geometric correction 
                applied to ensure data quality and consistency across the temporal series.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Multi-temporal SAR Analysis:</strong> Flood detection using Sentinel-1 C-band SAR data with VV and VH polarizations, 
                employing backscatter threshold analysis to distinguish flooded from non-flooded areas.
              </p>
              <p>
                <strong>Change Detection:</strong> Pre-flood and post-flood image comparison using statistical change detection algorithms 
                to identify areas with significant backscatter reduction indicating standing water.
              </p>
              <p>
                <strong>Classification & Validation:</strong> Machine learning classification combined with optical imagery validation 
                and ground truth data to achieve greater than 90% accuracy in flood extent mapping.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloodRiskMap;
