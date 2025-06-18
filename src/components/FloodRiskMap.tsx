
import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Download, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloodRiskMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(10);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Create a canvas for the flood risk visualization
    const canvas = document.createElement('canvas');
    canvas.width = mapContainer.current.offsetWidth;
    canvas.height = mapContainer.current.offsetHeight;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    mapContainer.current.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw flood risk areas for Jakarta simulation
    const drawFloodRiskMap = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw base map (simplified Jakarta coastline)
      ctx.fillStyle = '#e6f3ff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw land areas
      ctx.fillStyle = '#f0f8e8';
      ctx.fillRect(0, canvas.height * 0.3, canvas.width, canvas.height * 0.7);
      
      // Draw rivers and waterways
      ctx.strokeStyle = '#4a90e2';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.2, canvas.height * 0.3);
      ctx.quadraticCurveTo(canvas.width * 0.5, canvas.height * 0.6, canvas.width * 0.8, canvas.height * 0.9);
      ctx.stroke();
      
      // Draw flood risk zones with different colors
      const floodZones = [
        { x: 0.1, y: 0.4, width: 0.3, height: 0.2, risk: 'high' },
        { x: 0.3, y: 0.5, width: 0.4, height: 0.3, risk: 'medium' },
        { x: 0.6, y: 0.3, width: 0.3, height: 0.4, risk: 'low' },
        { x: 0.2, y: 0.7, width: 0.5, height: 0.2, risk: 'high' },
      ];
      
      floodZones.forEach(zone => {
        let color;
        switch (zone.risk) {
          case 'high':
            color = 'rgba(220, 53, 69, 0.6)';
            break;
          case 'medium':
            color = 'rgba(255, 193, 7, 0.6)';
            break;
          case 'low':
            color = 'rgba(40, 167, 69, 0.6)';
            break;
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(
          zone.x * canvas.width,
          zone.y * canvas.height,
          zone.width * canvas.width,
          zone.height * canvas.height
        );
      });
      
      // Draw grid lines based on zoom level
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 1;
      const gridSize = Math.max(20, 100 - zoomLevel * 5);
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Add some data points
      const dataPoints = [
        { x: 0.25, y: 0.5, value: '2.3m' },
        { x: 0.45, y: 0.6, value: '1.8m' },
        { x: 0.65, y: 0.4, value: '0.9m' },
        { x: 0.35, y: 0.75, value: '2.7m' },
      ];
      
      dataPoints.forEach(point => {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        const x = point.x * canvas.width;
        const y = point.y * canvas.height;
        
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Add text
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.fillText(point.value, x + 10, y - 5);
      });
    };

    drawFloodRiskMap();

    return () => {
      if (mapContainer.current && canvas.parentNode) {
        mapContainer.current.removeChild(canvas);
      }
    };
  }, [zoomLevel]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 2, 20));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 2, 5));
  };

  return (
    <div className="relative w-full h-full bg-slate-800/20 rounded-lg border border-slate-600/50 overflow-hidden">
      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button
          onClick={handleZoomIn}
          size="sm"
          variant="outline"
          className="bg-slate-800/70 border-slate-600/50 text-white hover:bg-slate-700/70 backdrop-blur-sm"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          onClick={handleZoomOut}
          size="sm"
          variant="outline"
          className="bg-slate-800/70 border-slate-600/50 text-white hover:bg-slate-700/70 backdrop-blur-sm"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Action buttons */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
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
          Download CSV
        </Button>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 border border-slate-600/50">
        <h4 className="text-white text-sm font-semibold mb-2">Flood Risk Level</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-300 text-xs">High Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-300 text-xs">Medium Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-300 text-xs">Low Risk</span>
          </div>
        </div>
      </div>
      
      {/* Data info overlay */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 border border-slate-600/50">
        <h4 className="text-white text-sm font-semibold">Flood Area Study</h4>
        <p className="text-gray-300 text-xs">Jakarta, Indonesia</p>
        <div className="mt-2 text-xs text-gray-400">
          <div>Pixels Flagged: 108,392</div>
          <div>Area: ~400km²</div>
        </div>
      </div>
    </div>
  );
};

export default FloodRiskMap;
