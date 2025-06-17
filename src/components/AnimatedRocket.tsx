
import { Rocket } from "lucide-react";

export const AnimatedRocket = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="animate-bounce">
        <Rocket className="h-8 w-8 text-cyan-400 transform rotate-45" />
      </div>
      {/* Rocket trail */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
        <div className="w-1 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent animate-pulse"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-6 bg-gradient-to-t from-red-500 via-orange-400 to-transparent animate-pulse opacity-60"></div>
      </div>
      {/* Exhaust particles */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full animate-ping"
            style={{
              left: `${-10 + i * 10}px`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    </div>
  );
};
