/**
 * RooftopScene — Scene 8 Rooftop 3D Environment
 * AI silhouette on rooftop overlooking neon city.
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { smoothstep, lerp } from '@/utils/math';

interface Props {
  progress: number;
  sceneTime: number;
}

export const RooftopScene: React.FC<Props> = ({ progress, sceneTime }) => {
  const figureRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame(({ camera }) => {
    // Slow cinematic push toward figure
    camera.position.x = Math.sin(sceneTime * 0.04) * 0.5;
    camera.position.y = lerp(7, 6.5, smoothstep(0, 25, sceneTime));
    camera.position.z = lerp(10, 7, smoothstep(0, 25, sceneTime));
    camera.lookAt(0, 5.5, -3);

    // Figure subtle breathing
    if (figureRef.current) {
      figureRef.current.position.y = 5.3 + Math.sin(sceneTime * 0.8) * 0.02;
    }

    // Glow pulse
    if (glowRef.current) {
      glowRef.current.intensity = 1 + Math.sin(sceneTime * 1.5) * 0.3;
    }
  });

  return (
    <group>
      {/* Rooftop platform */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[8, 0.3, 6]} />
        <meshStandardMaterial color="#08080c" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Rooftop edge railing */}
      <mesh position={[0, 5.25, -2.9]}>
        <boxGeometry args={[8, 0.2, 0.05]} />
        <meshStandardMaterial color="#15181f" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* AI silhouette figure */}
      <group ref={figureRef} position={[0, 5.3, -2.5]}>
        {/* Body */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.3, 1.0, 0.2]} />
          <meshStandardMaterial color="#0c0e14" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.3, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#0c0e14" />
        </mesh>
        {/* Cyan glow emanating from figure */}
        <pointLight ref={glowRef} position={[0, 0.8, 0.2]} intensity={1} color="#00f0ff" distance={3} decay={2} />
      </group>

      {/* Sky backdrop */}
      <mesh position={[0, 10, -20]}>
        <planeGeometry args={[60, 20]} />
        <meshBasicMaterial color="#020305" />
      </mesh>

      {/* Horizon glow */}
      <mesh position={[0, 5, -15]}>
        <planeGeometry args={[50, 8]} />
        <meshBasicMaterial color="#0a0e18" transparent opacity={0.4} />
      </mesh>

      {/* Key light */}
      <pointLight position={[5, 10, 5]} intensity={0.8} color="#1a3050" distance={30} decay={2} />
      {/* Neon accent from city below */}
      <pointLight position={[-3, 3, -8]} intensity={3} color="#00f0ff" distance={20} decay={2} />
      <pointLight position={[4, 3, -10]} intensity={2} color="#ff00aa" distance={18} decay={2} />
      <pointLight position={[0, 4, -6]} intensity={1.5} color="#7b2fff" distance={15} decay={2} />
    </group>
  );
};
