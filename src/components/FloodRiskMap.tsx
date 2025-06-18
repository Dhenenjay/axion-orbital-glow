import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Download, Share, Layers, Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloodRiskMap = () => {
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

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleSubmitQuery = () => {
    console.log('Rerunning query:', query);
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

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Map container */}
      <div 
        className="relative h-[600px] bg-slate-900/20 rounded-lg border border-slate-600/50 overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        {/* Draggable Query Overlay */}
        <div 
          className="absolute bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md rounded-xl p-4 border border-slate-600/50 shadow-xl max-w-md cursor-move z-20"
          style={{ 
            left: overlayPosition.x, 
            top: overlayPosition.y,
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
            <h4 className="text-white font-semibold">Active Query</h4>
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

        {/* Map container with new flood risk image */}
        <div 
          ref={mapContainer} 
          className="w-full h-full flex items-center justify-center overflow-hidden"
          style={{
            transform: `translate(${panPosition.x}px, ${panPosition.y}px)`
          }}
        >
          <img
            src="/lovable-uploads/b19b4dc0-559c-488d-9b72-ca43ef69ae53.png"
            alt="Jakarta Flood Risk Analysis - SAR Data Results"
            className="map-image max-w-none transition-transform duration-200 ease-out"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center'
            }}
            draggable={false}
          />
        </div>
        
        {/* Zoom controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
          <Button
            onClick={handleZoomIn}
            size="sm"
            variant="outline"
            className="bg-white/90 border-gray-300 text-gray-700 hover:bg-white shadow-md"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleZoomOut}
            size="sm"
            variant="outline"
            className="bg-white/90 border-gray-300 text-gray-700 hover:bg-white shadow-md"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Layer selector */}
        <div className="absolute top-4 right-20 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-300 shadow-md z-10">
          <h4 className="text-gray-700 text-xs font-semibold mb-2 flex items-center">
            <Layers className="w-3 h-3 mr-1" />
            SAR Analysis
          </h4>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedLayer('flood-depth')}
              className={`w-full text-left px-2 py-1 rounded text-xs transition-all ${
                selectedLayer === 'flood-depth' 
                  ? 'bg-blue-500/20 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Flood Extent
            </button>
            <button
              onClick={() => setSelectedLayer('economic')}
              className={`w-full text-left px-2 py-1 rounded text-xs transition-all ${
                selectedLayer === 'economic' 
                  ? 'bg-orange-500/20 text-orange-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              SAR Backscatter
            </button>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 border-gray-300 text-gray-700 hover:bg-white shadow-md"
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 border-gray-300 text-gray-700 hover:bg-white shadow-md"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        
        {/* Updated Legend for SAR Analysis */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-lg p-4 border border-gray-300 shadow-md z-10">
          <h4 className="text-gray-700 text-sm font-semibold mb-3">
            {selectedLayer === 'flood-depth' ? 'Flood Detection (SAR)' : 'Backscatter Intensity (dB)'}
          </h4>
          <div className="space-y-2">
            {selectedLayer === 'flood-depth' ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-600 rounded border"></div>
                  <span className="text-gray-700 text-xs">Flooded Areas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-400 rounded border"></div>
                  <span className="text-gray-700 text-xs">Water Bodies</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-white rounded border border-gray-400"></div>
                  <span className="text-gray-700 text-xs">Non-flooded Areas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded border"></div>
                  <span className="text-gray-700 text-xs">Urban Areas</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-600 rounded border"></div>
                  <span className="text-gray-700 text-xs">High (-5 to 0)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-orange-500 rounded border"></div>
                  <span className="text-gray-700 text-xs">Medium (-10 to -5)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded border"></div>
                  <span className="text-gray-700 text-xs">Low (-15 to -10)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-400 rounded border"></div>
                  <span className="text-gray-700 text-xs">Very Low (-20 to -15)</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Data info */}
        <div className="absolute top-20 right-4 bg-white/95 backdrop-blur-md rounded-lg p-3 border border-gray-300 shadow-md z-10">
          <h4 className="text-gray-700 text-sm font-semibold mb-1">Sentinel-1 SAR Analysis</h4>
          <p className="text-gray-600 text-xs mb-2">Jakarta Metropolitan Area</p>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Sensor:</span>
              <span className="text-blue-600">Sentinel-1 C-band</span>
            </div>
            <div className="flex justify-between">
              <span>Polarization:</span>
              <span className="text-blue-600">VV/VH</span>
            </div>
            <div className="flex justify-between">
              <span>Resolution:</span>
              <span className="text-blue-600">10m × 10m</span>
            </div>
            <div className="flex justify-between">
              <span>Method:</span>
              <span className="text-green-600">Multi-temporal</span>
            </div>
          </div>
        </div>

        {/* Zoom level indicator */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-lg px-3 py-2 border border-gray-300 shadow-md z-10">
          <div className="text-gray-700 text-xs font-semibold">
            Zoom: {Math.round(zoomLevel * 100)}%
          </div>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-600/50 p-6">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
          <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
          Methodology
        </h3>
        <div className="text-gray-300 space-y-2 text-sm leading-relaxed">
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
        </div>
      </div>
    </div>
  );
};

export default FloodRiskMap;
