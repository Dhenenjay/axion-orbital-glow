
import { AnimatedRocket } from "./AnimatedRocket";
import { AnimatedSatellite } from "./AnimatedSatellite";

export const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Rockets */}
      <AnimatedRocket className="absolute top-20 left-10 animate-bounce" style={{ animationDuration: '3s' }} />
      <AnimatedRocket className="absolute top-1/3 right-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      <AnimatedRocket className="absolute bottom-1/4 left-1/4 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '2s' }} />
      
      {/* Floating Satellites */}
      <AnimatedSatellite className="absolute top-1/4 left-1/3 animate-float" />
      <AnimatedSatellite className="absolute top-2/3 right-1/3 animate-float" style={{ animationDelay: '1.5s' }} />
      <AnimatedSatellite className="absolute bottom-1/3 right-10 animate-float" style={{ animationDelay: '3s' }} />
      
      {/* Moving stars */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
      
      {/* Shooting stars */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute w-20 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-shooting-star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            animationDelay: `${i * 2}s`,
            animationDuration: '3s'
          }}
        />
      ))}
    </div>
  );
};
