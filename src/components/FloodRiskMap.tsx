
import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Download, Share, Play, RotateCcw, Layers, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloodRiskMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [selectedLayer, setSelectedLayer] = useState('flood-depth');
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Create a canvas for the flood risk visualization
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

    // Jakarta geographic regions data
    const jakartaRegions = [
      // Central Jakarta
      { name: 'Central Jakarta', path: [[0.4, 0.45], [0.55, 0.45], [0.55, 0.55], [0.4, 0.55]], risk: 'high', type: 'commercial' },
      // North Jakarta (coastal area)
      { name: 'North Jakarta', path: [[0.25, 0.25], [0.75, 0.25], [0.75, 0.4], [0.25, 0.4]], risk: 'extreme', type: 'residential' },
      // West Jakarta
      { name: 'West Jakarta', path: [[0.15, 0.4], [0.4, 0.4], [0.4, 0.7], [0.15, 0.7]], risk: 'medium', type: 'residential' },
      // East Jakarta
      { name: 'East Jakarta', path: [[0.55, 0.4], [0.85, 0.4], [0.85, 0.7], [0.55, 0.7]], risk: 'medium', type: 'industry' },
      // South Jakarta
      { name: 'South Jakarta', path: [[0.3, 0.55], [0.7, 0.55], [0.7, 0.8], [0.3, 0.8]], risk: 'low', type: 'residential' },
      // Thousand Islands
      { name: 'Thousand Islands', path: [[0.2, 0.1], [0.35, 0.1], [0.35, 0.2], [0.2, 0.2]], risk: 'extreme', type: 'open-water' }
    ];

    // Rivers and waterways
    const waterways = [
      { name: 'Ciliwung River', path: [[0.5, 0.15], [0.45, 0.4], [0.4, 0.6], [0.35, 0.85]] },
      { name: 'Angke River', path: [[0.3, 0.3], [0.25, 0.5], [0.2, 0.7]] },
      { name: 'Sunter River', path: [[0.6, 0.25], [0.55, 0.45], [0.5, 0.65]] }
    ];

    const drawDetailedMap = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw ocean/sea background
      const oceanGradient = ctx.createLinearGradient(0, 0, 0, height * 0.4);
      oceanGradient.addColorStop(0, '#1e40af');
      oceanGradient.addColorStop(1, '#3b82f6');
      ctx.fillStyle = oceanGradient;
      ctx.fillRect(0, 0, width, height * 0.35);
      
      // Draw land base
      ctx.fillStyle = '#f5f5dc';
      ctx.fillRect(0, height * 0.35, width, height * 0.65);
      
      // Draw Jakarta regions with proper styling
      jakartaRegions.forEach(region => {
        const path = new Path2D();
        const coords = region.path.map(([x, y]) => [x * width, y * height]);
        
        path.moveTo(coords[0][0], coords[0][1]);
        coords.slice(1).forEach(([x, y]) => path.lineTo(x, y));
        path.closePath();
        
        // Fill based on flood risk and layer selection
        let fillColor;
        if (selectedLayer === 'flood-depth') {
          switch (region.risk) {
            case 'extreme':
              fillColor = 'rgba(0, 32, 96, 0.8)'; // Dark blue
              break;
            case 'high':
              fillColor = 'rgba(59, 130, 246, 0.8)'; // Blue
              break;
            case 'medium':
              fillColor = 'rgba(147, 197, 253, 0.8)'; // Light blue
              break;
            case 'low':
              fillColor = 'rgba(219, 234, 254, 0.8)'; // Very light blue
              break;
            default:
              fillColor = 'rgba(243, 244, 246, 0.8)';
          }
        } else {
          // Land use layer
          switch (region.type) {
            case 'commercial':
              fillColor = 'rgba(220, 38, 127, 0.8)'; // Pink
              break;
            case 'residential':
              fillColor = 'rgba(120, 53, 15, 0.8)'; // Brown
              break;
            case 'industry':
              fillColor = 'rgba(147, 51, 234, 0.8)'; // Purple
              break;
            case 'open-water':
              fillColor = 'rgba(59, 130, 246, 0.8)'; // Blue
              break;
            default:
              fillColor = 'rgba(34, 197, 94, 0.8)'; // Green
          }
        }
        
        ctx.fillStyle = fillColor;
        ctx.fill(path);
        
        // Add borders
        ctx.strokeStyle = hoveredRegion === region.name ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = hoveredRegion === region.name ? 3 : 1;
        ctx.stroke(path);
        
        // Add region labels
        const centerX = coords.reduce((sum, [x]) => sum + x, 0) / coords.length;
        const centerY = coords.reduce((sum, [, y]) => sum + y, 0) / coords.length;
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(region.name, centerX, centerY);
      });
      
      // Draw waterways
      waterways.forEach(waterway => {
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        const coords = waterway.path.map(([x, y]) => [x * width, y * height]);
        ctx.beginPath();
        ctx.moveTo(coords[0][0], coords[0][1]);
        coords.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.stroke();
      });
      
      // Add measurement points
      const measurementPoints = [
        { x: 0.3, y: 0.4, value: selectedLayer === 'flood-depth' ? '2.5m' : '$1.2M', label: 'Station A' },
        { x: 0.6, y: 0.3, value: selectedLayer === 'flood-depth' ? '3.1m' : '$890K', label: 'Station B' },
        { x: 0.45, y: 0.6, value: selectedLayer === 'flood-depth' ? '1.8m' : '$2.1M', label: 'Station C' },
        { x: 0.7, y: 0.5, value: selectedLayer === 'flood-depth' ? '0.9m' : '$650K', label: 'Station D' }
      ];
      
      measurementPoints.forEach(point => {
        const x = point.x * width;
        const y = point.y * height;
        
        // Draw point
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Draw value label
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(point.value, x + 12, y - 5);
        ctx.font = '9px Arial';
        ctx.fillText(point.label, x + 12, y + 8);
      });
      
      // Add scale bar
      const scaleBarWidth = 100;
      const scaleBarX = 20;
      const scaleBarY = height - 40;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(scaleBarX - 5, scaleBarY - 15, scaleBarWidth + 10, 25);
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scaleBarX, scaleBarY);
      ctx.lineTo(scaleBarX + scaleBarWidth, scaleBarY);
      ctx.stroke();
      
      // Scale markers
      for (let i = 0; i <= 2; i++) {
        const x = scaleBarX + (i * scaleBarWidth / 2);
        ctx.beginPath();
        ctx.moveTo(x, scaleBarY - 5);
        ctx.lineTo(x, scaleBarY + 5);
        ctx.stroke();
      }
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('0', scaleBarX, scaleBarY + 15);
      ctx.fillText('5km', scaleBarX + scaleBarWidth / 2, scaleBarY + 15);
      ctx.fillText('10km', scaleBarX + scaleBarWidth, scaleBarY + 15);
      
      // Add north arrow
      const arrowX = width - 50;
      const arrowY = 50;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 2;
      
      // Draw north arrow
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY - 15);
      ctx.lineTo(arrowX - 8, arrowY + 5);
      ctx.lineTo(arrowX + 8, arrowY + 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('N', arrowX, arrowY + 20);
    };

    drawDetailedMap();

    // Add click event listener for interactivity
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      
      // Check if click is on a region
      jakartaRegions.forEach(region => {
        const path = region.path;
        const minX = Math.min(...path.map(([px]) => px));
        const maxX = Math.max(...path.map(([px]) => px));
        const minY = Math.min(...path.map(([, py]) => py));
        const maxY = Math.max(...path.map(([, py]) => py));
        
        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
          setHoveredRegion(region.name);
          console.log(`Clicked on ${region.name} - Risk: ${region.risk}`);
        }
      });
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      if (mapContainer.current && canvas.parentNode) {
        mapContainer.current.removeChild(canvas);
      }
      canvas.removeEventListener('click', handleClick);
    };
  }, [zoomLevel, selectedLayer, hoveredRegion]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 2, 20));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 2, 5));
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  return (
    <div className="relative w-full h-full bg-slate-900/20 rounded-lg border border-slate-600/50 overflow-hidden">
      {/* Enhanced Prompt Overlay for re-running queries */}
      <div className="absolute top-4 left-4 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-md rounded-xl p-4 border border-slate-600/50 shadow-xl max-w-md">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
          <h4 className="text-white font-semibold">Active Query</h4>
        </div>
        <p className="text-gray-300 text-sm mb-3">
          "Map flood risk in Jakarta, Indonesia"
        </p>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-xs"
          >
            <Play className="w-3 h-3 mr-1" />
            Re-run
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-slate-800/50 border-slate-600/50 text-gray-300 hover:bg-slate-700/50 text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Modify
          </Button>
        </div>
      </div>

      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full cursor-crosshair" />
      
      {/* Enhanced Zoom and Layer controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-3">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-2 border border-slate-600/50">
          <Button
            onClick={handleZoomIn}
            size="sm"
            variant="outline"
            className="bg-transparent border-slate-600/50 text-white hover:bg-slate-700/50 backdrop-blur-sm mb-2 w-full"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleZoomOut}
            size="sm"
            variant="outline"
            className="bg-transparent border-slate-600/50 text-white hover:bg-slate-700/50 backdrop-blur-sm w-full"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Layer selector */}
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 border border-slate-600/50">
          <h4 className="text-white text-xs font-semibold mb-2 flex items-center">
            <Layers className="w-3 h-3 mr-1" />
            Layers
          </h4>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedLayer('flood-depth')}
              className={`w-full text-left px-2 py-1 rounded text-xs transition-all ${
                selectedLayer === 'flood-depth' 
                  ? 'bg-blue-500/30 text-blue-200' 
                  : 'text-gray-300 hover:bg-slate-700/50'
              }`}
            >
              Flood Depth
            </button>
            <button
              onClick={() => setSelectedLayer('land-use')}
              className={`w-full text-left px-2 py-1 rounded text-xs transition-all ${
                selectedLayer === 'land-use' 
                  ? 'bg-purple-500/30 text-purple-200' 
                  : 'text-gray-300 hover:bg-slate-700/50'
              }`}
            >
              Land Use
            </button>
          </div>
        </div>
      </div>
      
      {/* Enhanced Action buttons */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <Button
          onClick={toggleAnimation}
          size="sm"
          variant="outline"
          className={`backdrop-blur-sm border-slate-600/50 hover:bg-slate-700/70 transition-all ${
            isAnimating 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' 
              : 'bg-slate-800/70 text-white'
          }`}
        >
          <MapPin className="w-4 h-4 mr-2" />
          {isAnimating ? 'Stop' : 'Animate'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-slate-800/70 border-slate-600/50 text-white hover:bg-slate-700/70 backdrop-blur-sm"
        >
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-slate-800/70 border-slate-600/50 text-white hover:bg-slate-700/70 backdrop-blur-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
      
      {/* Enhanced Dynamic Legend */}
      <div className="absolute bottom-4 left-4 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md rounded-xl p-4 border border-slate-600/50 shadow-xl">
        <h4 className="text-white text-sm font-semibold mb-3">
          {selectedLayer === 'flood-depth' ? 'Inundation Depth (m)' : 'Land Use Classification'}
        </h4>
        <div className="space-y-2">
          {selectedLayer === 'flood-depth' ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-900 rounded border border-white/20"></div>
                <span className="text-gray-300 text-xs">3.0+ (Extreme)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-600 rounded border border-white/20"></div>
                <span className="text-gray-300 text-xs">2.0-3.0 (High)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-400 rounded border border-white/20"></div>
                <span className="text-gray-300 text-xs">1.0-2.0 (Medium)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-200 rounded border border-white/20"></div>
                <span className="text-gray-300 text-xs">0-1.0 (Low)</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-pink-600 rounded border border-white/20"></div>
                <span className="text-gray-300 text-xs">Commercial</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-600 rounded border border-white/20"></div>
                <span className="text-gray-300 text-xs">Industry</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded border border-white/20"></div>
                <span className="text-gray-300 text-xs">Open Water</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-600 rounded border border-white/20"></div>
                <span className="text-gray-300 text-xs">Green Space</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-amber-800 rounded border border-white/20"></div>
                <span className="text-gray-300 text-xs">Residential</span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Enhanced Data info overlay */}
      <div className="absolute top-20 right-4 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md rounded-xl p-4 border border-slate-600/50 shadow-xl">
        <h4 className="text-white text-sm font-semibold mb-1">Jakarta Flood Analysis</h4>
        <p className="text-gray-300 text-xs mb-3">DKI Jakarta, Indonesia</p>
        <div className="space-y-1 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>Grid Resolution:</span>
            <span className="text-cyan-300">100m</span>
          </div>
          <div className="flex justify-between">
            <span>Total Area:</span>
            <span className="text-cyan-300">664 km²</span>
          </div>
          <div className="flex justify-between">
            <span>At Risk Population:</span>
            <span className="text-red-300">2.8M</span>
          </div>
          <div className="flex justify-between">
            <span>Last Updated:</span>
            <span className="text-emerald-300">Live</span>
          </div>
        </div>
        {hoveredRegion && (
          <div className="mt-3 pt-3 border-t border-slate-600/50">
            <p className="text-yellow-300 text-xs font-medium">Selected: {hoveredRegion}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloodRiskMap;
