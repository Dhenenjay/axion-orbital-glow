import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Layers, 
  Satellite,
  Map as MapIcon,
  Eye,
  EyeOff,
  Settings,
  Play,
  Pause,
  Calendar,
  BarChart3,
  Share
} from 'lucide-react';

interface EarthEngineViewerProps {
  hasOutput: boolean;
  isCropQuery: boolean;
}

const EarthEngineViewer = ({ hasOutput, isCropQuery }: EarthEngineViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [center, setCenter] = useState(isCropQuery ? [75.5726, 31.3559] : [106.845, -6.208]);
  const [visibleLayers, setVisibleLayers] = useState<string[]>(['base']);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2023-01-15');
  const [opacity, setOpacity] = useState(80);

  // Enhanced layer data for satellite imagery analysis
  const layerData = isCropQuery ? {
    'base': { 
      name: 'Sentinel-2 RGB', 
      opacity: 100, 
      color: '#4ade80',
      description: 'Sentinel-2 L2A Surface Reflectance',
      resolution: '10m',
      dateRange: '2022-10-01 to 2023-04-30'
    },
    'ndvi': { 
      name: 'NDVI', 
      opacity: 80, 
      color: '#22c55e',
      description: 'Normalized Difference Vegetation Index',
      resolution: '10m',
      dateRange: '2022-10-01 to 2023-04-30'
    },
    'classification': { 
      name: 'Crop Classification', 
      opacity: 90, 
      color: '#a855f7',
      description: 'Random Forest Classification',
      resolution: '10m',
      dateRange: 'Rabi Season 2022-23'
    },
    'boundary': { 
      name: 'Study Area', 
      opacity: 100, 
      color: '#ef4444',
      description: 'Hoshiarpur District Boundary',
      resolution: 'Vector',
      dateRange: 'Administrative Boundary'
    }
  } : {
    'base': { 
      name: 'SAR Imagery', 
      opacity: 100, 
      color: '#3b82f6',
      description: 'Sentinel-1 Ground Range Detected',
      resolution: '10m',
      dateRange: '2020-01-15 to 2020-01-25'
    },
    'flood': { 
      name: 'Flood Risk', 
      opacity: 85, 
      color: '#1d4ed8',
      description: 'Flood Extent Analysis',
      resolution: '10m',
      dateRange: 'January 20, 2020'
    },
    'population': { 
      name: 'Population Risk', 
      opacity: 75, 
      color: '#dc2626',
      description: 'WorldPop Population Density',
      resolution: '100m',
      dateRange: '2020'
    }
  };

  // Statistics data
  const statistics = isCropQuery ? {
    totalArea: '2,847 km²',
    wheatArea: '1,234 km²',
    potatoArea: '567 km²',
    plantationArea: '892 km²',
    accuracy: '94.2%'
  } : {
    floodArea: '156 km²',
    populationAtRisk: '47,832 people',
    highRiskZones: '12 areas',
    economicLoss: '$2.3M',
    accuracy: '89.7%'
  };

  const toggleLayer = (layerId: string) => {
    setVisibleLayers(prev => 
      prev.includes(layerId) 
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId]
    );
  };


  return (
    <div className="h-full flex flex-col bg-[hsl(var(--editor-bg))]">
      {/* Map Controls Header */}
      <div className="h-10 bg-[hsl(var(--editor-panel))] border-b border-[hsl(var(--editor-border))] flex items-center justify-between px-3">
        <div className="flex items-center space-x-3">
          <Satellite className="w-4 h-4 text-[hsl(var(--editor-accent))]" />
          <span className="text-sm font-medium text-[hsl(var(--editor-text))]">Map</span>
          <div className="h-4 w-px bg-[hsl(var(--editor-border))]"></div>
          <span className="text-xs text-[hsl(var(--editor-text-muted))]">
            {isCropQuery ? 'Hoshiarpur, Punjab' : 'Jakarta, Indonesia'}
          </span>
          <span className="text-xs text-[hsl(var(--editor-text-muted))]">
            Zoom: {zoomLevel}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-[hsl(var(--editor-text-muted))] hover:text-[hsl(var(--editor-text))] hover:bg-[hsl(var(--editor-sidebar))]"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
            Animation
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-[hsl(var(--editor-text-muted))] hover:text-[hsl(var(--editor-text))] hover:bg-[hsl(var(--editor-sidebar))]"
          >
            <Share className="w-3 h-3 mr-1" />
            Share
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Map Display */}
        <div className="flex-1 relative bg-[hsl(var(--editor-panel))]">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ cursor: 'grab' }}
          />
          
          {/* Map Controls Overlay */}
          <div className="absolute top-3 right-3 flex flex-col space-y-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-[hsl(var(--editor-panel))]/90 backdrop-blur-sm text-[hsl(var(--editor-text))] hover:bg-[hsl(var(--editor-sidebar))] border border-[hsl(var(--editor-border))]"
              onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-[hsl(var(--editor-panel))]/90 backdrop-blur-sm text-[hsl(var(--editor-text))] hover:bg-[hsl(var(--editor-sidebar))] border border-[hsl(var(--editor-border))]"
              onClick={() => setZoomLevel(prev => Math.max(prev - 1, 1))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-[hsl(var(--editor-panel))]/90 backdrop-blur-sm text-[hsl(var(--editor-text))] hover:bg-[hsl(var(--editor-sidebar))] border border-[hsl(var(--editor-border))]"
              onClick={() => {
                setZoomLevel(10);
                setCenter(isCropQuery ? [75.5726, 31.3559] : [106.845, -6.208]);
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Coordinates Display */}
          <div className="absolute bottom-3 left-3 bg-[hsl(var(--editor-panel))]/90 backdrop-blur-sm text-[hsl(var(--editor-text))] px-3 py-1.5 rounded-md text-xs border border-[hsl(var(--editor-border))]">
            <div>Lat: {center[1].toFixed(4)}°</div>
            <div>Lng: {center[0].toFixed(4)}°</div>
            <div>Scale: 1:{Math.pow(2, 20 - zoomLevel) * 1000}</div>
          </div>

          {/* Attribution */}
          <div className="absolute bottom-1 right-1/2 transform translate-x-1/2 bg-[hsl(var(--editor-panel))]/90 backdrop-blur-sm text-[hsl(var(--editor-text-muted))] px-2 py-0.5 rounded text-xs border border-[hsl(var(--editor-border))]">
            © Satellite Data, Esri, DigitalGlobe
          </div>

          {/* Mock satellite imagery */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-br from-green-900/20 via-green-800/30 to-green-700/20"></div>
            {isCropQuery && (
              <>
                <div className="absolute top-1/4 left-1/3 w-20 h-16 bg-purple-500/60 rounded-sm"></div>
                <div className="absolute top-1/3 right-1/3 w-24 h-20 bg-yellow-500/60 rounded-sm"></div>
                <div className="absolute bottom-1/3 left-1/4 w-18 h-18 bg-green-500/60 rounded-sm"></div>
              </>
            )}
            {!isCropQuery && (
              <>
                <div className="absolute top-1/2 left-1/2 w-32 h-24 bg-blue-500/50 rounded-lg transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-red-500 rounded-full"></div>
                <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full"></div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EarthEngineViewer;