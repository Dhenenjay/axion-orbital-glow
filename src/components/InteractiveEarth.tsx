
import { useState } from 'react';
import { Globe3D } from './Globe3D';

export const InteractiveEarth = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * zoomFactor)));
  };

  return (
    <div className="relative flex items-center justify-center h-full">
      <div
        className="relative group cursor-pointer transition-transform duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onWheel={handleWheel}
      >
        {/* 3D Globe */}
        <Globe3D isHovered={isHovered} zoom={zoom} />
        
        {/* Hover glow effect */}
        {isHovered && (
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-400/30 to-blue-500/30 blur-sm animate-pulse pointer-events-none"></div>
        )}
      </div>
      
      {/* Interactive controls overlay */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white">
          <div>🌍 Real 3D Earth Globe</div>
          <div>Scroll to zoom • Drag to rotate</div>
        </div>
      </div>

      {/* Satellite info overlay */}
      <div className="absolute bottom-4 left-4 space-y-1">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-1 text-xs">
          <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
          <span className="text-yellow-300">GPS Satellites</span>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-1 text-xs">
          <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2"></span>
          <span className="text-red-300">Communication</span>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-1 text-xs">
          <span className="inline-block w-2 h-2 bg-teal-400 rounded-full mr-2"></span>
          <span className="text-teal-300">Weather</span>
        </div>
      </div>
      
      {/* Status indicator */}
      {isHovered && (
        <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm animate-fade-in">
          🛰️ Interactive 3D Earth • Zoom: {Math.round(zoom * 100)}%
        </div>
      )}

      {/* Zoom indicator */}
      {zoom !== 1 && (
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white">
          Zoom: {(zoom * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
};
