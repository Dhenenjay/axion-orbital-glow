
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [center, setCenter] = useState(isCropQuery ? [75.5726, 31.3559] : [106.845, -6.208]);
  const [mapStyle, setMapStyle] = useState<'satellite' | 'terrain' | 'hybrid'>('satellite');
  const [visibleLayers, setVisibleLayers] = useState<string[]>(['base']);
  const [mapTiles, setMapTiles] = useState<{ [key: string]: HTMLImageElement }>({});

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

  // Convert lat/lng to tile coordinates
  const deg2num = (lat: number, lon: number, zoom: number) => {
    const latRad = lat * Math.PI / 180;
    const n = Math.pow(2, zoom);
    const x = Math.floor((lon + 180) / 360 * n);
    const y = Math.floor((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2 * n);
    return { x, y };
  };

  // Load map tiles
  const loadMapTiles = async () => {
    if (!hasOutput) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate tile coordinates
    const { x: centerX, y: centerY } = deg2num(center[1], center[0], zoomLevel);
    
    // Load multiple tiles for better coverage
    const tileSize = 256;
    const tilesX = Math.ceil(canvas.width / tileSize) + 1;
    const tilesY = Math.ceil(canvas.height / tileSize) + 1;
    
    const startX = centerX - Math.floor(tilesX / 2);
    const startY = centerY - Math.floor(tilesY / 2);

    // Use different tile sources based on map style
    const getTileUrl = (x: number, y: number, z: number) => {
      if (mapStyle === 'satellite') {
        // Use satellite imagery (ESRI World Imagery)
        return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
      } else {
        // Use OpenStreetMap for terrain
        return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
      }
    };

    // Load and draw tiles
    for (let i = 0; i < tilesX; i++) {
      for (let j = 0; j < tilesY; j++) {
        const tileX = startX + i;
        const tileY = startY + j;
        
        if (tileX >= 0 && tileY >= 0 && tileX < Math.pow(2, zoomLevel) && tileY < Math.pow(2, zoomLevel)) {
          const tileKey = `${zoomLevel}-${tileX}-${tileY}`;
          
          if (!mapTiles[tileKey]) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              setMapTiles(prev => ({ ...prev, [tileKey]: img }));
            };
            img.onerror = () => {
              // Fallback to a solid color if tile fails to load
              const fallbackImg = new Image();
              fallbackImg.onload = () => {
                setMapTiles(prev => ({ ...prev, [tileKey]: fallbackImg }));
              };
              // Create a simple colored tile as fallback
              const fallbackCanvas = document.createElement('canvas');
              fallbackCanvas.width = tileSize;
              fallbackCanvas.height = tileSize;
              const fallbackCtx = fallbackCanvas.getContext('2d');
              if (fallbackCtx) {
                fallbackCtx.fillStyle = mapStyle === 'satellite' ? '#2d5a2d' : '#f0f0f0';
                fallbackCtx.fillRect(0, 0, tileSize, tileSize);
                fallbackImg.src = fallbackCanvas.toDataURL();
              }
            };
            img.src = getTileUrl(tileX, tileY, zoomLevel);
          }
        }
      }
    }
  };

  // Draw the map
  useEffect(() => {
    if (!hasOutput) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const drawMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw base map tiles
      const { x: centerX, y: centerY } = deg2num(center[1], center[0], zoomLevel);
      const tileSize = 256;
      const scale = Math.pow(2, zoomLevel - Math.floor(zoomLevel));
      
      Object.entries(mapTiles).forEach(([key, img]) => {
        const [z, x, y] = key.split('-').map(Number);
        if (z === zoomLevel) {
          const screenX = (x - centerX) * tileSize + canvas.width / 2;
          const screenY = (y - centerY) * tileSize + canvas.height / 2;
          ctx.drawImage(img, screenX, screenY, tileSize, tileSize);
        }
      });

      // Add data overlays based on query type
      if (isCropQuery) {
        // Draw crop classification overlay
        ctx.globalAlpha = 0.6;
        
        // Wheat fields
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(canvas.width * 0.2, canvas.height * 0.3, 80, 60);
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.fillText('Wheat', canvas.width * 0.2 + 25, canvas.height * 0.3 + 35);
        
        // Plantation
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(canvas.width * 0.4, canvas.height * 0.25, 100, 80);
        ctx.fillStyle = 'white';
        ctx.fillText('Plantation', canvas.width * 0.4 + 25, canvas.height * 0.25 + 45);
        
        // Potato fields
        ctx.fillStyle = '#eab308';
        ctx.fillRect(canvas.width * 0.6, canvas.height * 0.4, 70, 70);
        ctx.fillStyle = 'black';
        ctx.fillText('Potato', canvas.width * 0.6 + 20, canvas.height * 0.4 + 40);
        
        ctx.globalAlpha = 1;
      } else {
        // Draw flood risk overlay
        ctx.globalAlpha = 0.5;
        
        // High flood risk area
        const gradient = ctx.createRadialGradient(
          canvas.width * 0.4, canvas.height * 0.5, 0,
          canvas.width * 0.4, canvas.height * 0.5, 100
        );
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(canvas.width * 0.2, canvas.height * 0.3, 200, 150);
        
        // Population at risk indicators (red dots)
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(canvas.width * 0.3, canvas.height * 0.4, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(canvas.width * 0.5, canvas.height * 0.6, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(canvas.width * 0.4, canvas.height * 0.7, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1;
      }
    };

    drawMap();
    loadMapTiles();
  }, [hasOutput, zoomLevel, center, mapStyle, mapTiles, isCropQuery]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 18));
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
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `earth-engine-output-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
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
        <div className="flex-1 relative bg-[#2d2d30]">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ cursor: 'grab' }}
          />
          
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

          {/* Attribution */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-0.5 rounded text-xs">
            © {mapStyle === 'satellite' ? 'Esri, DigitalGlobe' : 'OpenStreetMap contributors'}
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
