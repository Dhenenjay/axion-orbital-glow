
import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Download, Share, Layers, Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloodRiskMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [selectedLayer, setSelectedLayer] = useState('flood-depth');
  const [query, setQuery] = useState("Map flood risk in Jakarta, Indonesia");
  const [overlayPosition, setOverlayPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!mapContainer.current) return;

    // Create a canvas for the realistic flood risk map
    const canvas = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = mapContainer.current.offsetWidth * dpr;
    canvas.height = mapContainer.current.offsetHeight * dpr;
    canvas.style.width = mapContainer.current.offsetWidth + 'px';
    canvas.style.height = mapContainer.current.offsetHeight + 'px';
    mapContainer.current.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.scale(dpr, dpr);
    const width = mapContainer.current.offsetWidth;
    const height = mapContainer.current.offsetHeight;

    const drawRealisticMap = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Create a realistic satellite-style base map
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
      gradient.addColorStop(0, '#f8f9fa');
      gradient.addColorStop(0.5, '#e9ecef');
      gradient.addColorStop(1, '#dee2e6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw coastlines and water bodies
      ctx.fillStyle = '#0066cc';
      
      // Java Sea (north)
      ctx.fillRect(0, 0, width, height * 0.35);
      
      // Jakarta Bay area
      ctx.beginPath();
      ctx.moveTo(width * 0.2, height * 0.35);
      ctx.quadraticCurveTo(width * 0.5, height * 0.25, width * 0.8, height * 0.35);
      ctx.lineTo(width * 0.8, height * 0.45);
      ctx.quadraticCurveTo(width * 0.5, height * 0.4, width * 0.2, height * 0.45);
      ctx.closePath();
      ctx.fill();

      // Land mass (Jakarta)
      ctx.fillStyle = '#8fbc8f';
      ctx.fillRect(0, height * 0.35, width, height * 0.65);

      // Urban areas
      ctx.fillStyle = '#d3d3d3';
      
      // Central Jakarta
      ctx.fillRect(width * 0.4, height * 0.45, width * 0.2, height * 0.15);
      
      // North Jakarta districts
      ctx.fillRect(width * 0.25, height * 0.35, width * 0.5, height * 0.1);
      
      // West Jakarta
      ctx.fillRect(width * 0.1, height * 0.5, width * 0.25, height * 0.2);
      
      // East Jakarta
      ctx.fillRect(width * 0.65, height * 0.5, width * 0.25, height * 0.2);

      // Rivers (Ciliwung, etc.)
      ctx.strokeStyle = '#4682b4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width * 0.5, height * 0.35);
      ctx.quadraticCurveTo(width * 0.48, height * 0.5, width * 0.45, height * 0.7);
      ctx.quadraticCurveTo(width * 0.43, height * 0.85, width * 0.4, height);
      ctx.stroke();

      // Additional rivers
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width * 0.3, height * 0.4);
      ctx.quadraticCurveTo(width * 0.25, height * 0.6, width * 0.2, height * 0.8);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width * 0.7, height * 0.4);
      ctx.quadraticCurveTo(width * 0.65, height * 0.6, width * 0.6, height * 0.8);
      ctx.stroke();

      // Flood risk overlay based on selected layer
      if (selectedLayer === 'flood-depth') {
        // High risk areas (dark blue)
        ctx.fillStyle = 'rgba(0, 50, 150, 0.7)';
        
        // North Jakarta coastal areas
        ctx.fillRect(width * 0.25, height * 0.35, width * 0.5, height * 0.08);
        
        // River flood zones
        ctx.beginPath();
        ctx.arc(width * 0.48, height * 0.55, 40, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(width * 0.28, height * 0.6, 35, 0, 2 * Math.PI);
        ctx.fill();

        // Medium risk areas (medium blue)
        ctx.fillStyle = 'rgba(50, 100, 200, 0.6)';
        
        ctx.fillRect(width * 0.35, height * 0.6, width * 0.3, height * 0.1);
        ctx.fillRect(width * 0.15, height * 0.55, width * 0.2, height * 0.15);

        // Low risk areas (light blue)
        ctx.fillStyle = 'rgba(100, 150, 255, 0.4)';
        
        ctx.fillRect(width * 0.4, height * 0.75, width * 0.2, height * 0.1);
        ctx.fillRect(width * 0.65, height * 0.65, width * 0.2, height * 0.1);
      }

      // Grid overlay for satellite data effect
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Data points and measurement stations
      const stations = [
        { x: 0.3, y: 0.4, value: '2.5m', risk: 'high' },
        { x: 0.6, y: 0.35, value: '3.1m', risk: 'extreme' },
        { x: 0.45, y: 0.6, value: '1.8m', risk: 'medium' },
        { x: 0.7, y: 0.55, value: '0.9m', risk: 'low' },
        { x: 0.25, y: 0.65, value: '2.2m', risk: 'high' }
      ];

      stations.forEach(station => {
        const x = station.x * width;
        const y = station.y * height;
        
        // Station marker
        ctx.fillStyle = station.risk === 'extreme' ? '#ff0000' : 
                       station.risk === 'high' ? '#ff6600' :
                       station.risk === 'medium' ? '#ffaa00' : '#00aa00';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Value label
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(station.value, x + 10, y - 3);
      });

      // Scale and north arrow
      drawMapElements();
    };

    const drawMapElements = () => {
      // Scale bar
      const scaleWidth = 80;
      const scaleX = 20;
      const scaleY = height - 30;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(scaleX - 3, scaleY - 10, scaleWidth + 6, 20);
      
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scaleX, scaleY);
      ctx.lineTo(scaleX + scaleWidth, scaleY);
      ctx.stroke();
      
      // Scale markers
      ctx.lineWidth = 1;
      for (let i = 0; i <= 2; i++) {
        const x = scaleX + (i * scaleWidth / 2);
        ctx.beginPath();
        ctx.moveTo(x, scaleY - 3);
        ctx.lineTo(x, scaleY + 3);
        ctx.stroke();
      }
      
      ctx.fillStyle = '#000000';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('0', scaleX, scaleY + 15);
      ctx.fillText('5km', scaleX + scaleWidth / 2, scaleY + 15);
      ctx.fillText('10km', scaleX + scaleWidth, scaleY + 15);
      
      // North arrow
      const arrowX = width - 40;
      const arrowY = 40;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(arrowX - 20, arrowY - 20, 40, 40);
      
      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY - 12);
      ctx.lineTo(arrowX - 6, arrowY + 6);
      ctx.lineTo(arrowX + 6, arrowY + 6);
      ctx.closePath();
      ctx.fill();
      
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('N', arrowX, arrowY + 18);
    };

    drawRealisticMap();

    return () => {
      if (mapContainer.current && canvas.parentNode) {
        mapContainer.current.removeChild(canvas);
      }
    };
  }, [zoomLevel, selectedLayer]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 2, 20));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 2, 5));
  };

  const handleSubmitQuery = () => {
    console.log('Rerunning query:', query);
    // Here you would typically trigger the analysis again
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - overlayPosition.x,
      y: e.clientY - overlayPosition.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setOverlayPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="relative w-full h-full bg-slate-900/20 rounded-lg border border-slate-600/50 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Draggable Query Overlay */}
      <div 
        className="absolute bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md rounded-xl p-4 border border-slate-600/50 shadow-xl max-w-md cursor-move z-20"
        style={{ 
          left: overlayPosition.x, 
          top: overlayPosition.y,
          userSelect: 'none'
        }}
        onMouseDown={handleMouseDown}
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
          />
        </div>
        <Button
          onClick={handleSubmitQuery}
          size="sm"
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm w-full"
        >
          <Zap className="w-4 h-4 mr-2" />
          Submit Query
        </Button>
      </div>

      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full" />
      
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
    </div>
  );
};

export default FloodRiskMap;
