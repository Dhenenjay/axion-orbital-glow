
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Layers, 
  MapPin,
  Satellite,
  Map as MapIcon,
  Eye,
  EyeOff
} from 'lucide-react';

interface MapViewerProps {
  hasOutput: boolean;
  isCropQuery: boolean;
}

const MapViewer = ({ hasOutput, isCropQuery }: MapViewerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [center, setCenter] = useState(isCropQuery ? [75.5726, 31.3559] : [106.845, -6.208]);
  const [mapStyle, setMapStyle] = useState<'satellite' | 'terrain' | 'hybrid'>('satellite');
  const [visibleLayers, setVisibleLayers] = useState<string[]>(['base']);

  // Mock satellite imagery data based on query type
  const layerData = isCropQuery ? {
    'base': { name: 'Sentinel-2 RGB', opacity: 100, color: '#4ade80' },
    'ndvi': { name: 'NDVI', opacity: 80, color: '#22c55e' },
    'classification': { name: 'Crop Classification', opacity: 90, color: '#a855f7' },
    'boundary': { name: 'Study Area', opacity: 100, color: '#ef4444' }
  } : {
    'base': { name: 'SAR Imagery', opacity: 100, color: '#3b82f6' },
    'flood': { name: 'Flood Risk', opacity: 85, color: '#1d4ed8' },
    'population': { name: 'Population Risk', opacity: 75, color: '#dc2626' }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    setZoomLevel(10);
    setCenter(isCropQuery ? [75.5726, 31.3559] : [106.845, -6.208]);
  };

  const toggleLayer = (layerId: string) => {
    setVisibleLayers(prev => 
      prev.includes(layerId) 
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId]
    );
  };

  const exportMap = () => {
    // Mock export functionality
    console.log('Exporting map...');
  };

  if (!hasOutput) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#1e1e1e] text-[#858585]">
        <div className="text-center space-y-3">
          <MapIcon className="w-16 h-16 mx-auto opacity-50" />
          <h3 className="text-lg font-medium text-[#cccccc]">No Output Generated</h3>
          <p className="text-sm max-w-sm">
            Run your Earth Engine code or submit a query to see the map output here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* Map Controls Header */}
      <div className="h-10 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center justify-between px-3">
        <div className="flex items-center space-x-2">
          <MapIcon className="w-4 h-4 text-[#4fc1ff]" />
          <span className="text-xs font-medium text-white">Map Output</span>
          <span className="text-xs text-[#858585]">
            {isCropQuery ? 'Hoshiarpur, Punjab' : 'Jakarta, Indonesia'}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]"
            onClick={() => setMapStyle(mapStyle === 'satellite' ? 'terrain' : 'satellite')}
          >
            {mapStyle === 'satellite' ? <Satellite className="w-3 h-3" /> : <MapIcon className="w-3 h-3" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]"
            onClick={exportMap}
          >
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Map Display */}
        <div className="flex-1 relative bg-gradient-to-br from-green-900 via-blue-900 to-purple-900">
          <div 
            ref={mapRef}
            className="w-full h-full relative overflow-hidden"
            style={{
              backgroundImage: isCropQuery 
                ? `linear-gradient(45deg, #22c55e 0%, #16a34a 50%, #15803d 100%)`
                : `linear-gradient(45deg, #1e40af 0%, #1d4ed8 50%, #2563eb 100%)`,
            }}
          >
            {/* Simulated satellite imagery overlay */}
            <div className="absolute inset-0 opacity-60">
              <svg width="100%" height="100%" viewBox="0 0 400 300">
                {/* Grid pattern to simulate imagery */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Mock data visualizations */}
                {isCropQuery ? (
                  <>
                    {/* Crop field polygons */}
                    <rect x="50" y="80" width="60" height="40" fill="#a855f7" opacity="0.7" rx="3" />
                    <text x="80" y="105" fill="white" fontSize="8" textAnchor="middle">Wheat</text>
                    
                    <rect x="120" y="60" width="80" height="60" fill="#22c55e" opacity="0.7" rx="3" />
                    <text x="160" y="95" fill="white" fontSize="8" textAnchor="middle">Plantation</text>
                    
                    <rect x="220" y="90" width="50" height="50" fill="#eab308" opacity="0.7" rx="3" />
                    <text x="245" y="120" fill="white" fontSize="8" textAnchor="middle">Potato</text>
                    
                    <rect x="290" y="70" width="70" height="45" fill="#f97316" opacity="0.7" rx="3" />
                    <text x="325" y="97" fill="white" fontSize="8" textAnchor="middle">Other</text>
                  </>
                ) : (
                  <>
                    {/* Flood risk areas */}
                    <ellipse cx="150" cy="120" rx="80" ry="50" fill="#3b82f6" opacity="0.8" />
                    <text x="150" y="125" fill="white" fontSize="8" textAnchor="middle">High Flood Risk</text>
                    
                    <ellipse cx="280" cy="180" rx="60" ry="40" fill="#1d4ed8" opacity="0.6" />
                    <text x="280" y="185" fill="white" fontSize="8" textAnchor="middle">Medium Risk</text>
                    
                    {/* Population density indicators */}
                    <circle cx="200" cy="100" r="8" fill="#dc2626" opacity="0.9" />
                    <circle cx="250" cy="140" r="6" fill="#dc2626" opacity="0.9" />
                    <circle cx="180" cy="160" r="10" fill="#dc2626" opacity="0.9" />
                  </>
                )}
              </svg>
            </div>
            
            {/* Zoom controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 bg-black/50 text-white hover:bg-black/70"
                onClick={handleZoomIn}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 bg-black/50 text-white hover:bg-black/70"
                onClick={handleZoomOut}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 bg-black/50 text-white hover:bg-black/70"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Coordinates display */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
              <div>Lat: {center[1].toFixed(4)}°</div>
              <div>Lng: {center[0].toFixed(4)}°</div>
              <div>Zoom: {zoomLevel}</div>
            </div>
            
            {/* Scale indicator */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
              Scale: 1:{Math.pow(2, 20 - zoomLevel) * 1000}
            </div>
          </div>
        </div>

        {/* Layer Control Panel */}
        <div className="w-64 bg-[#252526] border-l border-[#2d2d30] flex flex-col">
          <div className="p-3 border-b border-[#3e3e42]">
            <h4 className="text-xs font-semibold text-white mb-2">Active Layers</h4>
            <div className="space-y-2">
              {Object.entries(layerData).map(([id, layer]) => (
                <div key={id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 p-0 text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]"
                      onClick={() => toggleLayer(id)}
                    >
                      {visibleLayers.includes(id) ? 
                        <Eye className="w-3 h-3" /> : 
                        <EyeOff className="w-3 h-3" />
                      }
                    </Button>
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span className="text-xs text-[#cccccc]">{layer.name}</span>
                  </div>
                  <span className="text-xs text-[#858585]">{layer.opacity}%</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-3 border-b border-[#3e3e42]">
            <h4 className="text-xs font-semibold text-white mb-2">Map Style</h4>
            <div className="grid grid-cols-2 gap-1">
              <Button
                size="sm"
                variant={mapStyle === 'satellite' ? 'default' : 'ghost'}
                className="text-xs h-7"
                onClick={() => setMapStyle('satellite')}
              >
                Satellite
              </Button>
              <Button
                size="sm"
                variant={mapStyle === 'terrain' ? 'default' : 'ghost'}
                className="text-xs h-7"
                onClick={() => setMapStyle('terrain')}
              >
                Terrain
              </Button>
            </div>
          </div>
          
          <div className="p-3">
            <h4 className="text-xs font-semibold text-white mb-2">Export Options</h4>
            <div className="space-y-1">
              <Button
                size="sm"
                variant="ghost"
                className="w-full justify-start text-xs h-7 text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]"
                onClick={exportMap}
              >
                <Download className="w-3 h-3 mr-2" />
                Export as PNG
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="w-full justify-start text-xs h-7 text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]"
                onClick={exportMap}
              >
                <Download className="w-3 h-3 mr-2" />
                Export to Drive
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapViewer;
