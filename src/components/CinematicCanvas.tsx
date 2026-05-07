/**
 * CinematicCanvas — React Three Fiber Canvas Wrapper
 * Configured for cinematic rendering with fog, lighting, and post-processing.
 */
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA } from '@/config/rendering';

interface CinematicCanvasProps {
  children: React.ReactNode;
  className?: string;
  quality?: 'preview' | 'production';
}

export const CinematicCanvas: React.FC<CinematicCanvasProps> = ({
  children,
  className,
  quality = 'preview',
}) => {
  const dpr = quality === 'production' ? [1, 2] as [number, number] : [1, 1] as [number, number];

  return (
    <Canvas
      className={className}
      dpr={dpr}
      gl={{
        antialias: quality === 'production',
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.8,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      camera={{
        fov: CAMERA.fov,
        near: CAMERA.near,
        far: CAMERA.far,
        position: [0, 0, 10],
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#0a0a0f',
      }}
    >
      <Suspense fallback={null}>
        {/* Global fog */}
        <fog attach="fog" args={[0x050510, 20, 80]} />

        {/* Minimal ambient light */}
        <ambientLight intensity={0.05} color="#1a1a2e" />

        {children}
      </Suspense>
    </Canvas>
  );
};
