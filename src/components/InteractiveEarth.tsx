
import { useEffect, useRef, useState } from 'react';

export const InteractiveEarth = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [rotationOffset, setRotationOffset] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = Math.min(centerX, centerY) - 40;
    const radius = baseRadius * zoom;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create realistic Earth gradient (blue oceans to darker space)
      const earthGradient = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        0,
        centerX,
        centerY,
        radius
      );
      earthGradient.addColorStop(0, '#87CEEB'); // Light blue (ocean)
      earthGradient.addColorStop(0.3, '#4682B4'); // Steel blue
      earthGradient.addColorStop(0.7, '#2F4F4F'); // Dark slate gray
      earthGradient.addColorStop(1, '#191970'); // Midnight blue

      // Draw Earth sphere
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = earthGradient;
      ctx.fill();

      // Add subtle shadow for 3D effect
      const shadowGradient = ctx.createRadialGradient(
        centerX + radius * 0.3,
        centerY + radius * 0.3,
        0,
        centerX,
        centerY,
        radius
      );
      shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      shadowGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.3)');
      shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = shadowGradient;
      ctx.fill();

      // Atmosphere glow
      const atmosphereGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius,
        centerX,
        centerY,
        radius + 15
      );
      atmosphereGradient.addColorStop(0, 'rgba(135, 206, 250, 0.4)');
      atmosphereGradient.addColorStop(1, 'rgba(135, 206, 250, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 15, 0, Math.PI * 2);
      ctx.fillStyle = atmosphereGradient;
      ctx.fill();

      // Draw realistic continents
      ctx.fillStyle = '#228B22'; // Forest green for land
      ctx.globalAlpha = 0.9;
      
      const currentRotation = rotation * 0.002 + rotationOffset;
      
      // North America
      ctx.beginPath();
      const naX = centerX + Math.cos(currentRotation - 1.5) * radius * 0.4;
      const naY = centerY - radius * 0.3;
      ctx.ellipse(naX, naY, radius * 0.25, radius * 0.4, currentRotation - 1.5, 0, Math.PI * 2);
      ctx.fill();

      // South America
      ctx.beginPath();
      const saX = centerX + Math.cos(currentRotation - 1.3) * radius * 0.35;
      const saY = centerY + radius * 0.2;
      ctx.ellipse(saX, saY, radius * 0.15, radius * 0.5, currentRotation - 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Africa
      ctx.beginPath();
      const afX = centerX + Math.cos(currentRotation) * radius * 0.15;
      const afY = centerY;
      ctx.ellipse(afX, afY, radius * 0.2, radius * 0.6, currentRotation, 0, Math.PI * 2);
      ctx.fill();

      // Europe
      ctx.beginPath();
      const euX = centerX + Math.cos(currentRotation + 0.2) * radius * 0.1;
      const euY = centerY - radius * 0.4;
      ctx.ellipse(euX, euY, radius * 0.15, radius * 0.2, currentRotation + 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Asia
      ctx.beginPath();
      const asX = centerX + Math.cos(currentRotation + 0.8) * radius * 0.3;
      const asY = centerY - radius * 0.2;
      ctx.ellipse(asX, asY, radius * 0.35, radius * 0.4, currentRotation + 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Australia
      ctx.beginPath();
      const auX = centerX + Math.cos(currentRotation + 1.2) * radius * 0.45;
      const auY = centerY + radius * 0.4;
      ctx.ellipse(auX, auY, radius * 0.1, radius * 0.08, currentRotation + 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;

      // Draw latitude and longitude grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      
      // Latitude lines
      for (let i = -3; i <= 3; i++) {
        if (i === 0) continue; // Skip equator for now
        const y = centerY + (i * radius * 0.25);
        const ellipseWidth = Math.sqrt(Math.max(0, radius * radius - (i * radius * 0.25) * (i * radius * 0.25)));
        
        ctx.beginPath();
        ctx.ellipse(centerX, y, ellipseWidth, ellipseWidth * 0.1, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Equator (more prominent)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius, radius * 0.1, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Longitude lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + currentRotation;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius, radius * 0.2, angle, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw realistic satellites in different orbits
      const satelliteOrbits = [
        { count: 4, distance: radius + 50, speed: 0.003, color: '#FFD700', name: 'GPS' },
        { count: 6, distance: radius + 80, speed: 0.002, color: '#FF6B6B', name: 'Communication' },
        { count: 3, distance: radius + 120, speed: 0.001, color: '#4ECDC4', name: 'Weather' }
      ];

      satelliteOrbits.forEach((orbit, orbitIndex) => {
        for (let i = 0; i < orbit.count; i++) {
          const angle = (i / orbit.count) * Math.PI * 2 + rotation * orbit.speed + orbitIndex;
          const x = centerX + Math.cos(angle) * orbit.distance;
          const y = centerY + Math.sin(angle) * orbit.distance * 0.3; // Flattened orbit

          // Satellite body
          ctx.fillStyle = orbit.color;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();

          // Solar panels
          ctx.fillStyle = 'rgba(100, 149, 237, 0.8)';
          ctx.fillRect(x - 6, y - 1, 12, 2);
          ctx.fillRect(x - 1, y - 6, 2, 12);

          // Orbital trail
          ctx.strokeStyle = `${orbit.color}30`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, orbit.distance, orbit.distance * 0.3, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Hover effect
      if (isHovered) {
        ctx.strokeStyle = 'rgba(135, 206, 250, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Zoom indicator
      if (zoom !== 1) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '12px Arial';
        ctx.fillText(`Zoom: ${(zoom * 100).toFixed(0)}%`, 10, 20);
      }
    };

    let animationId: number;
    
    const step = () => {
      animate();
      if (!isDragging) {
        setRotation(prev => prev + 0.3);
      }
      animationId = requestAnimationFrame(step);
    };
    
    animationId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationId);
  }, [rotation, isHovered, zoom, isDragging, rotationOffset]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const currentPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    setMousePosition(currentPos);

    if (isDragging) {
      const deltaX = currentPos.x - lastMousePos.x;
      setRotationOffset(prev => prev + deltaX * 0.01);
      setLastMousePos(currentPos);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setLastMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * zoomFactor)));
  };

  return (
    <div className="relative flex items-center justify-center h-full">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="cursor-grab active:cursor-grabbing transition-transform duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsDragging(false);
        }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      />
      
      {/* Interactive controls overlay */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white">
          <div>🌍 Interactive Earth</div>
          <div>Drag to rotate • Scroll to zoom</div>
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
          🛰️ Real-time Earth Visualization • {isDragging ? 'Rotating' : 'Auto-spin'}
        </div>
      )}
    </div>
  );
};
