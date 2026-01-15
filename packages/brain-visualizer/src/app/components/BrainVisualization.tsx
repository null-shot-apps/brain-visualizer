'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Extend react-three-fiber with THREE.Line
extend({ Line: THREE.Line });

interface BrainRegion {
  position: [number, number, number];
  size: number;
  color: string;
  name: string;
}

interface BrainVisualizationProps {
  activeRegions: string[];
}

const brainRegions: Record<string, BrainRegion[]> = {
  happy: [
    { position: [-0.8, 0.5, 0.3], size: 0.35, color: '#FFD700', name: 'Left Prefrontal Cortex' },
    { position: [0.8, 0.5, 0.3], size: 0.35, color: '#FFA500', name: 'Right Prefrontal Cortex' },
    { position: [0, -0.3, -0.5], size: 0.3, color: '#FF69B4', name: 'Nucleus Accumbens' },
    { position: [-0.4, -0.2, 0], size: 0.25, color: '#FFB6C1', name: 'Left Amygdala' },
  ],
  sad: [
    { position: [0.8, 0.5, 0.3], size: 0.4, color: '#4169E1', name: 'Right Prefrontal Cortex' },
    { position: [-0.4, -0.2, 0], size: 0.35, color: '#1E90FF', name: 'Left Amygdala' },
    { position: [0.4, -0.2, 0], size: 0.35, color: '#00BFFF', name: 'Right Amygdala' },
    { position: [0, 0.3, -0.6], size: 0.3, color: '#87CEEB', name: 'Anterior Cingulate' },
  ],
  angry: [
    { position: [-0.4, -0.2, 0], size: 0.45, color: '#FF0000', name: 'Left Amygdala' },
    { position: [0.4, -0.2, 0], size: 0.45, color: '#DC143C', name: 'Right Amygdala' },
    { position: [0, -0.5, 0.2], size: 0.3, color: '#FF4500', name: 'Hypothalamus' },
    { position: [0, 0.6, 0.4], size: 0.25, color: '#FF6347', name: 'Dorsal ACC' },
  ],
  fearful: [
    { position: [-0.4, -0.2, 0], size: 0.5, color: '#9370DB', name: 'Left Amygdala' },
    { position: [0.4, -0.2, 0], size: 0.5, color: '#8A2BE2', name: 'Right Amygdala' },
    { position: [0, -0.5, 0.2], size: 0.35, color: '#BA55D3', name: 'Hypothalamus' },
    { position: [0, 0.2, 0.8], size: 0.3, color: '#DDA0DD', name: 'Periaqueductal Gray' },
  ],
  excited: [
    { position: [-0.8, 0.5, 0.3], size: 0.4, color: '#00FF00', name: 'Left Prefrontal Cortex' },
    { position: [0.8, 0.5, 0.3], size: 0.4, color: '#32CD32', name: 'Right Prefrontal Cortex' },
    { position: [0, -0.3, -0.5], size: 0.4, color: '#7FFF00', name: 'Nucleus Accumbens' },
    { position: [0, -0.5, 0.2], size: 0.3, color: '#ADFF2F', name: 'Hypothalamus' },
    { position: [0, 0.8, 0], size: 0.25, color: '#98FB98', name: 'Motor Cortex' },
  ],
  calm: [
    { position: [0, 0.3, -0.6], size: 0.4, color: '#20B2AA', name: 'Anterior Cingulate' },
    { position: [-0.8, 0.5, 0.3], size: 0.35, color: '#48D1CC', name: 'Left Prefrontal Cortex' },
    { position: [0, -0.6, -0.3], size: 0.3, color: '#40E0D0', name: 'Brainstem' },
    { position: [0.6, 0.2, -0.5], size: 0.25, color: '#AFEEEE', name: 'Insula' },
  ],
};

function Brain({ activeRegions }: BrainVisualizationProps) {
  const brainRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const activeRegionData = useMemo(() => {
    return activeRegions.flatMap(emotion => brainRegions[emotion] || []);
  }, [activeRegions]);

  return (
    <group ref={groupRef}>
      {/* Main brain structure */}
      <Sphere ref={brainRef} args={[1.5, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#1a1a2e"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.4}
          metalness={0.8}
          opacity={0.6}
          transparent
        />
      </Sphere>

      {/* Active brain regions */}
      {activeRegionData.map((region, index) => (
        <ActiveRegion key={`${region.name}-${index}`} region={region} index={index} />
      ))}

      {/* Neural connections */}
      {activeRegionData.length > 1 && (
        <NeuralConnections regions={activeRegionData} />
      )}
    </group>
  );
}

function ActiveRegion({ region, index }: { region: BrainRegion; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3 + index) * 0.1 + 1;
      meshRef.current.scale.setScalar(pulse);
    }
    if (lightRef.current) {
      const intensity = Math.sin(state.clock.elapsedTime * 3 + index) * 2 + 3;
      lightRef.current.intensity = intensity;
    }
  });

  return (
    <group position={region.position}>
      <Sphere ref={meshRef} args={[region.size, 32, 32]}>
        <meshStandardMaterial
          color={region.color}
          emissive={region.color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </Sphere>
      <pointLight ref={lightRef} color={region.color} intensity={3} distance={3} />
    </group>
  );
}

function NeuralConnections({ regions }: { regions: BrainRegion[] }) {
  // Simplified: just show glowing particles between regions instead of complex lines
  return null;
}

export default function BrainVisualization({ activeRegions }: BrainVisualizationProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <Brain activeRegions={activeRegions} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={true}
          minDistance={3}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
















