/**
 * CityScape — Procedural Cyberpunk City Environment (Scenes 5 & 8)
 */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { randomRange, smoothstep, lerp } from '@/utils/math';

interface Props {
  progress: number;
  sceneTime: number;
  variant: 'aerial' | 'rooftop';
}

interface BuildingData {
  position: [number, number, number];
  scale: [number, number, number];
  emissiveColor: THREE.Color;
  windowSeed: number;
}

export const CityScape: React.FC<Props> = ({ progress, sceneTime, variant }) => {
  const groupRef = useRef<THREE.Group>(null);
  const buildingsRef = useRef<THREE.InstancedMesh>(null);

  const buildings = useMemo<BuildingData[]>(() => {
    const data: BuildingData[] = [];
    const colors = [
      new THREE.Color('#00f0ff'),
      new THREE.Color('#ff00aa'),
      new THREE.Color('#7b2fff'),
      new THREE.Color('#ffaa00'),
    ];
    for (let x = -15; x <= 15; x += 1.5) {
      for (let z = -10; z <= 5; z += 1.5) {
        const dist = Math.sqrt(x * x + z * z);
        const h = randomRange(1, 8) * (1 - Math.min(dist / 20, 0.7));
        data.push({
          position: [x + randomRange(-0.2, 0.2), h / 2, z + randomRange(-0.2, 0.2)],
          scale: [randomRange(0.5, 1.2), h, randomRange(0.5, 1.2)],
          emissiveColor: colors[Math.floor(Math.random() * colors.length)],
          windowSeed: Math.random() * 100,
        });
      }
    }
    return data;
  }, []);

  const tempObj = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ camera, clock }) => {
    if (!buildingsRef.current) return;
    const t = clock.getElapsedTime();

    // Update building instances
    buildings.forEach((b, i) => {
      tempObj.position.set(...b.position);
      tempObj.scale.set(...b.scale);
      tempObj.updateMatrix();
      buildingsRef.current!.setMatrixAt(i, tempObj.matrix);
    });
    buildingsRef.current.instanceMatrix.needsUpdate = true;

    // Camera motion
    if (variant === 'aerial') {
      camera.position.x = Math.sin(sceneTime * 0.05) * 5;
      camera.position.y = lerp(12, 8, smoothstep(0, 20, sceneTime));
      camera.position.z = lerp(15, 10, smoothstep(0, 25, sceneTime));
      camera.lookAt(0, 2, -2);
    } else {
      camera.position.set(0, 6, 8);
      camera.position.x += Math.sin(sceneTime * 0.08) * 0.5;
      camera.lookAt(0, 3, -5);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground plane with reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 30]} />
        <meshStandardMaterial color="#060608" metalness={0.95} roughness={0.1} envMapIntensity={0.5} />
      </mesh>

      {/* Building instances */}
      <instancedMesh ref={buildingsRef} args={[undefined, undefined, buildings.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#0a0c14" metalness={0.7} roughness={0.3} emissive="#020408" emissiveIntensity={0.2} />
      </instancedMesh>

      {/* Neon city lights */}
      <pointLight position={[-5, 4, -3]} intensity={3} color="#00f0ff" distance={15} decay={2} />
      <pointLight position={[6, 3, -5]} intensity={2} color="#ff00aa" distance={12} decay={2} />
      <pointLight position={[0, 6, -8]} intensity={1.5} color="#7b2fff" distance={20} decay={2} />
      <pointLight position={[3, 2, 0]} intensity={1} color="#ffaa00" distance={10} decay={2} />

      {/* Volumetric fog simulation via planes */}
      <mesh position={[0, 1.5, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 20]} />
        <meshBasicMaterial color="#050510" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
