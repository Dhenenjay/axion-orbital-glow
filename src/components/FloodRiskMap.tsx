
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
    <div 
      className="relative w-full h-full bg-slate-900/20 rounded-lg border border-slate-600/50 overflow-hidden cursor-grab active:cursor-grabbing"
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

      {/* Map container with image */}
      <div 
        ref={mapContainer} 
        className="w-full h-full flex items-center justify-center overflow-hidden"
        style={{
          transform: `translate(${panPosition.x}px, ${panPosition.y}px)`
        }}
      >
        <img
          src="/lovable-uploads/47dfb494-c80b-48d4-a600-73b8ffa28b45.png"
          alt="Jakarta Flood Risk Map"
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
          Layers
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
            Flood Depth
          </button>
          <button
            onClick={() => setSelectedLayer('satellite')}
            className={`w-full text-left px-2 py-1 rounded text-xs transition-all ${
              selectedLayer === 'satellite' 
                ? 'bg-green-500/20 text-green-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Satellite
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
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-lg p-4 border border-gray-300 shadow-md z-10">
        <h4 className="text-gray-700 text-sm font-semibold mb-3">
          Flood Risk Level (m)
        </h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-600 rounded border"></div>
            <span className="text-gray-700 text-xs">Extreme (3.0+)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-orange-500 rounded border"></div>
            <span className="text-gray-700 text-xs">High (2.0-3.0)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-yellow-500 rounded border"></div>
            <span className="text-gray-700 text-xs">Medium (1.0-2.0)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded border"></div>
            <span className="text-gray-700 text-xs">Low (0-1.0)</span>
          </div>
        </div>
      </div>
      
      {/* Data info */}
      <div className="absolute top-20 right-4 bg-white/95 backdrop-blur-md rounded-lg p-3 border border-gray-300 shadow-md z-10">
        <h4 className="text-gray-700 text-sm font-semibold mb-1">Jakarta Analysis</h4>
        <p className="text-gray-600 text-xs mb-2">DKI Jakarta, Indonesia</p>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Resolution:</span>
            <span className="text-blue-600">100m</span>
          </div>
          <div className="flex justify-between">
            <span>Area:</span>
            <span className="text-blue-600">664 km²</span>
          </div>
          <div className="flex justify-between">
            <span>Population at Risk:</span>
            <span className="text-red-600">2.8M</span>
          </div>
          <div className="flex justify-between">
            <span>Updated:</span>
            <span className="text-green-600">Live</span>
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
  );
};

export default FloodRiskMap;
