
import { useEffect, useRef, useState } from 'react';

export const InteractiveEarth = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient for Earth
      const gradient = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        0,
        centerX,
        centerY,
        radius
      );
      gradient.addColorStop(0, '#4facfe');
      gradient.addColorStop(0.3, '#00f2fe');
      gradient.addColorStop(0.7, '#1e3c72');
      gradient.addColorStop(1, '#0f2027');

      // Draw Earth sphere
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Add atmosphere glow
      const atmosphereGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius,
        centerX,
        centerY,
        radius + 20
      );
      atmosphereGradient.addColorStop(0, 'rgba(64, 224, 255, 0.3)');
      atmosphereGradient.addColorStop(1, 'rgba(64, 224, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 20, 0, Math.PI * 2);
      ctx.fillStyle = atmosphereGradient;
      ctx.fill();

      // Draw continents (simplified) - much smoother rotation
      ctx.fillStyle = '#2d5a27';
      ctx.globalAlpha = 0.8;
      
      // Smooth rotation offset - reduced speed significantly
      const rotationOffset = rotation * 0.003; // Much slower rotation
      
      // Africa
      ctx.beginPath();
      ctx.ellipse(
        centerX + Math.cos(rotationOffset) * radius * 0.1,
        centerY + radius * 0.2,
        radius * 0.3,
        radius * 0.6,
        rotationOffset,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Asia
      ctx.beginPath();
      ctx.ellipse(
        centerX + Math.cos(rotationOffset + Math.PI * 0.3) * radius * 0.4,
        centerY - radius * 0.1,
        radius * 0.4,
        radius * 0.3,
        rotationOffset + Math.PI * 0.3,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Americas
      ctx.beginPath();
      ctx.ellipse(
        centerX + Math.cos(rotationOffset + Math.PI) * radius * 0.6,
        centerY,
        radius * 0.2,
        radius * 0.8,
        rotationOffset + Math.PI,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.globalAlpha = 1;

      // Draw grid lines
      ctx.strokeStyle = 'rgba(64, 224, 255, 0.3)';
      ctx.lineWidth = 1;
      
      // Latitude lines
      for (let i = -2; i <= 2; i++) {
        const y = centerY + (i * radius * 0.3);
        const width = Math.sqrt(Math.max(0, radius * radius - (i * radius * 0.3) * (i * radius * 0.3)));
        
        ctx.beginPath();
        ctx.ellipse(centerX, y, width, width * 0.1, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitude lines
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + rotationOffset;
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          radius,
          radius * 0.3,
          angle,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // Draw satellites - slower orbital movement
      const satelliteCount = 6;
      for (let i = 0; i < satelliteCount; i++) {
        const angle = (i / satelliteCount) * Math.PI * 2 + rotation * 0.005; // Much slower
        const distance = radius + 40 + Math.sin(rotation * 0.01 + i) * 10; // Smoother oscillation
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance * 0.5;

        // Satellite body
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Satellite trail
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, distance, angle - 0.5, angle);
        ctx.stroke();
      }

      // Hover effect
      if (isHovered) {
        ctx.strokeStyle = 'rgba(64, 224, 255, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    let animationId: number;
    
    const step = () => {
      animate();
      setRotation(prev => prev + 0.5); // Much slower increment
      animationId = requestAnimationFrame(step);
    };
    
    animationId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationId);
  }, [rotation, isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="relative flex items-center justify-center h-full">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="cursor-pointer transition-transform duration-300 hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      />
      
      {/* Data points overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Hover info */}
      {isHovered && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm animate-fade-in">
          Interactive Earth • Real-time Satellite Data
        </div>
      )}
    </div>
  );
};
