/**
 * DatacenterEnvironment — Scene 1 3D Environment
 * Procedural server rack grid with animated LED lights,
 * central awakening glow, and neural pathway geometry.
 */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { smoothstep, lerp, pulse } from '@/utils/math';

interface Props {
  progress: number;
  sceneTime: number;
}

/** Single server rack with LED indicators */
const ServerRack: React.FC<{ position: [number, number, number]; bootProgress: number; index: number }> = ({
  position, bootProgress, index
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ledsRef = useRef<THREE.InstancedMesh>(null);
  const ledCount = 16;
  const tempObj = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    if (!ledsRef.current) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < ledCount; i++) {
      const threshold = (i / ledCount) * 0.6 + index * 0.05;
      const on = bootProgress > threshold;
      const brightness = on ? 0.5 + Math.sin(t * 2 + i * 0.5 + index) * 0.3 : 0;
      tempObj.position.set(0, i * 0.35 - (ledCount * 0.35) / 2, 0.26);
      tempObj.scale.setScalar(on ? 0.08 : 0.04);
      tempObj.updateMatrix();
      ledsRef.current.setMatrixAt(i, tempObj.matrix);
      tempColor.setHSL(0.52 + (i % 3) * 0.1, 0.9, brightness * 0.5);
      ledsRef.current.setColorAt(i, tempColor);
    }
    ledsRef.current.instanceMatrix.needsUpdate = true;
    if (ledsRef.current.instanceColor) ledsRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <group position={position}>
      {/* Rack body */}
      <mesh ref={meshRef}>
        <boxGeometry args={[0.8, ledCount * 0.35, 0.5]} />
        <meshStandardMaterial color="#0a0c12" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* LED instances */}
      <instancedMesh ref={ledsRef} args={[undefined, undefined, ledCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
};

export const DatacenterEnvironment: React.FC<Props> = ({ progress, sceneTime }) => {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const bootProgress = smoothstep(0, 15, sceneTime);
  const eyeOpen = smoothstep(8, 16, sceneTime);

  // Camera dolly
  useFrame(({ camera }) => {
    const targetZ = lerp(15, 8, smoothstep(0, 20, sceneTime));
    camera.position.z = lerp(camera.position.z, targetZ, 0.02);
    camera.position.y = lerp(camera.position.y, Math.sin(sceneTime * 0.1) * 0.5, 0.02);
  });

  // Awakening glow animation
  useFrame(() => {
    if (!glowRef.current) return;
    const scale = eyeOpen * 4;
    glowRef.current.scale.setScalar(scale);
    (glowRef.current.material as THREE.MeshBasicMaterial).opacity = eyeOpen * 0.15;
  });

  const rackPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 6; col++) {
        positions.push([col * 1.5 - 3.75, 0, row * 2 - 2]);
      }
    }
    return positions;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Datacenter floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#050508" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#050508" />
      </mesh>

      {/* Server racks */}
      {rackPositions.map((pos, i) => (
        <ServerRack key={i} position={pos} bootProgress={bootProgress} index={i} />
      ))}

      {/* Awakening central glow */}
      <mesh ref={glowRef} position={[0, 0, 2]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0} toneMapped={false} />
      </mesh>

      {/* Key light — cool cyan from above */}
      <pointLight position={[2, 5, 4]} intensity={2} color="#00a0c0" distance={25} decay={2} />
      {/* Fill light — purple from left */}
      <pointLight position={[-5, 2, 3]} intensity={1} color="#7b2fff" distance={20} decay={2} />
      {/* Accent — dim blue from behind */}
      <pointLight position={[0, 1, -5]} intensity={0.5} color="#1a4fff" distance={15} decay={2} />
    </group>
  );
};
