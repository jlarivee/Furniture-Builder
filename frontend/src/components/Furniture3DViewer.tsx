import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { FurnitureSpecs } from '../types';
import { generateFurnitureModel, hexToThreeColor, FurniturePart } from '../utils/furnitureModelGenerator';
import { Maximize2, RotateCw, ZoomIn, ZoomOut, Home } from 'lucide-react';

interface Furniture3DViewerProps {
  specs: FurnitureSpecs;
  className?: string;
}

function FurniturePart3D({ part }: { part: FurniturePart }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Convert inches to meters
  const toMeters = (inches: number) => inches * 0.0254;

  const position: [number, number, number] = [
    toMeters(part.position[0]),
    toMeters(part.position[1]),
    toMeters(part.position[2])
  ];

  const dimensions: [number, number, number] = [
    toMeters(part.dimensions[0]),
    toMeters(part.dimensions[1]),
    toMeters(part.dimensions[2])
  ];

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={dimensions} />
      <meshStandardMaterial
        color={part.color || '#8B4513'}
        roughness={0.7}
        metalness={0.1}
        emissive={hovered ? part.color || '#8B4513' : '#000000'}
        emissiveIntensity={hovered ? 0.2 : 0}
      />
    </mesh>
  );
}

function FurnitureModel({ specs }: { specs: FurnitureSpecs }) {
  const groupRef = useRef<THREE.Group>(null);
  const model = generateFurnitureModel(specs);

  return (
    <group ref={groupRef}>
      {model.parts.map((part, index) => (
        <FurniturePart3D key={`${part.name}-${index}`} part={part} />
      ))}
    </group>
  );
}

function Scene({ specs }: { specs: FurnitureSpecs }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -5]} intensity={0.5} />
      <spotLight position={[0, 15, 0]} intensity={0.3} angle={0.3} penumbra={1} />

      {/* Environment */}
      <Environment preset="studio" />

      {/* Grid */}
      <Grid
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#6b7280"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#374151"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid
      />

      {/* Furniture Model */}
      <Suspense fallback={null}>
        <FurnitureModel specs={specs} />
      </Suspense>
    </>
  );
}

export default function Furniture3DViewer({ specs, className = '' }: Furniture3DViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsRef = useRef<any>(null);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const viewerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-gray-900'
    : `relative ${className}`;

  return (
    <div className={viewerClass}>
      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          <Maximize2 size={20} className="text-gray-700" />
        </button>
        <button
          onClick={resetCamera}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
          title="Reset View"
        >
          <Home size={20} className="text-gray-700" />
        </button>
      </div>

      {/* Info Overlay */}
      <div className="absolute bottom-4 left-4 z-10 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
        <h3 className="font-semibold text-gray-900 mb-1">{specs.name}</h3>
        <p className="text-sm text-gray-600">
          {specs.dimensions.length}" × {specs.dimensions.width}" × {specs.dimensions.height}"
        </p>
        <div className="mt-2 text-xs text-gray-500">
          <p>🖱️ Left click + drag to rotate</p>
          <p>🖱️ Right click + drag to pan</p>
          <p>🔍 Scroll to zoom</p>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [3, 2, 3], fov: 50 }}>
        <PerspectiveCamera makeDefault position={[3, 2, 3]} />
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2}
        />
        <Scene specs={specs} />
      </Canvas>

      {/* Close button for fullscreen */}
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 left-4 z-10 px-4 py-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-gray-700 font-medium">Close Fullscreen</span>
        </button>
      )}
    </div>
  );
}
