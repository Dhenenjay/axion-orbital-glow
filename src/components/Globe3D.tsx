
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function EarthSphere({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Use a high-quality Earth texture from NASA
  const earthTexture = useTexture('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=2048&h=1024&fit=crop');
  
  // Auto-rotate the Earth
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2, 64, 32]} scale={isHovered ? 1.1 : 1}>
      <meshStandardMaterial 
        map={earthTexture} 
        roughness={0.8}
        metalness={0.1}
      />
    </Sphere>
  );
}

function Satellites() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* GPS Satellites */}
      {[...Array(4)].map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const x = Math.cos(angle) * 4;
        const z = Math.sin(angle) * 4;
        return (
          <mesh key={`gps-${i}`} position={[x, 0, z]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
          </mesh>
        );
      })}
      
      {/* Communication Satellites */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
        const x = Math.cos(angle) * 5;
        const z = Math.sin(angle) * 5;
        const y = Math.sin(i * 0.5) * 1;
        return (
          <mesh key={`comm-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

export const Globe3D = ({ isHovered, zoom }: { isHovered: boolean; zoom: number }) => {
  return (
    <div className="w-96 h-96">
      <Canvas camera={{ position: [0, 0, 8 / zoom], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#4f46e5" />
        
        {/* Earth */}
        <EarthSphere isHovered={isHovered} />
        
        {/* Satellites */}
        <Satellites />
        
        {/* Orbital rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.5, 3.51, 64]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0, Math.PI / 4]}>
          <ringGeometry args={[4, 4.01, 64]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
        </mesh>
        
        {/* Controls */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI - Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};
