
import { Satellite } from "lucide-react";

export const AnimatedSatellite = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="animate-pulse">
        <Satellite className="h-6 w-6 text-blue-400" />
      </div>
      {/* Signal waves */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute border border-cyan-400 rounded-full animate-ping"
            style={{
              width: `${30 + i * 20}px`,
              height: `${30 + i * 20}px`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
      {/* Data streams */}
      <div className="absolute top-0 left-0">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-8 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse"
            style={{
              transform: `rotate(${i * 90}deg)`,
              transformOrigin: 'bottom',
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};
