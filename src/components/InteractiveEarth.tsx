
import { useState } from 'react';

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
        style={{ transform: `scale(${zoom})` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onWheel={handleWheel}
      >
        {/* Main Earth Image */}
        <div className="relative w-96 h-96 rounded-full overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=800&fit=crop&crop=center"
            alt="Earth from space"
            className="w-full h-full object-cover"
          />
          
          {/* Atmosphere glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 via-transparent to-blue-600/30"></div>
          
          {/* Subtle shadow overlay for 3D effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
          
          {/* Hover glow effect */}
          {isHovered && (
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-400/30 to-blue-500/30 blur-sm animate-pulse"></div>
          )}
        </div>

        {/* Orbital rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[450px] h-[450px] border border-cyan-400/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[500px] border border-blue-400/15 rounded-full animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}></div>
        </div>

        {/* Floating satellites */}
        <div className="absolute inset-0">
          {/* GPS Satellites */}
          {[...Array(4)].map((_, i) => {
            const angle = (i / 4) * 360;
            return (
              <div
                key={`gps-${i}`}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-240px)`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            );
          })}
          
          {/* Communication Satellites */}
          {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * 360;
            return (
              <div
                key={`comm-${i}`}
                className="absolute w-2 h-2 bg-red-400 rounded-full animate-pulse"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${angle + 30}deg) translateY(-280px)`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            );
          })}
        </div>
      </div>
      
      {/* Interactive controls overlay */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white">
          <div>🌍 Real Earth View</div>
          <div>Scroll to zoom • Hover for effects</div>
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
          🛰️ Real Earth from Space • Zoom: {Math.round(zoom * 100)}%
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
