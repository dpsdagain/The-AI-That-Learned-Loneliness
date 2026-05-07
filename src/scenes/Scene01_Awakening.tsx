/**
 * Scene01_Awakening — AI boots up inside a massive datacenter
 * Layers: 3D datacenter + 2D particles/neural + Typography
 */
import React, { useRef, useCallback, useMemo } from 'react';
import { CinematicCanvas } from '@/components/CinematicCanvas';
import { OverlayCanvas } from '@/components/OverlayCanvas';
import { Typography } from '@/components/Typography';
import { Vignette } from '@/components/Vignette';
import { DatacenterEnvironment } from '@/scenes/3d/DatacenterEnvironment';
import { ParticleEngine, PARTICLE_PRESETS } from '@/effects/ParticleEngine';
import { NeuralNetwork } from '@/effects/NeuralNetwork';
import { DataStream } from '@/effects/DataStream';
import { getNarrationForScene } from '@/config/narration';
import { smoothstep } from '@/utils/math';

interface Props {
  sceneTime: number;
  progress: number;
  fadeAlpha: number;
  width: number;
  height: number;
}

export const Scene01_Awakening: React.FC<Props> = ({
  sceneTime, progress, fadeAlpha, width, height,
}) => {
  const narrationLines = useMemo(() => getNarrationForScene('awakening'), []);

  // Initialize effect systems (stable references)
  const effectsRef = useRef<{
    particles: ParticleEngine;
    neural: NeuralNetwork;
    dataStream: DataStream;
    lastTime: number;
  } | null>(null);

  if (!effectsRef.current) {
    effectsRef.current = {
      particles: new ParticleEngine(PARTICLE_PRESETS.data, width, height, 0.5),
      neural: new NeuralNetwork(width, height, 30),
      dataStream: new DataStream(width, height),
      lastTime: 0,
    };
  }

  const draw2D = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const eff = effectsRef.current!;
    const dt = Math.min(sceneTime - eff.lastTime, 0.1);
    eff.lastTime = sceneTime;

    // Neural network appears in second half
    eff.neural.setIntensity(smoothstep(12, 20, sceneTime) * (1 - smoothstep(22, 25, sceneTime)));
    eff.neural.update(dt);
    eff.neural.render(ctx, 0.6);

    // Data stream in first half
    eff.dataStream.setIntensity(smoothstep(2, 8, sceneTime) * (1 - smoothstep(18, 22, sceneTime)) * 0.3);
    eff.dataStream.update(dt);
    eff.dataStream.render(ctx, 0.4);

    // Ambient particles throughout
    eff.particles.update(dt);
    eff.particles.render(ctx, 0.6);
  }, [sceneTime]);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: fadeAlpha }}>
      {/* 3D Layer */}
      <CinematicCanvas>
        <DatacenterEnvironment progress={progress} sceneTime={sceneTime} />
      </CinematicCanvas>

      {/* 2D Effects Overlay */}
      <OverlayCanvas width={width} height={height} draw={draw2D} />

      {/* Typography */}
      <Typography lines={narrationLines} sceneTime={sceneTime} width={width} height={height} />

      {/* CRT scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 15,
        background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)`,
        opacity: 0.5,
      }} />

      <Vignette intensity={0.5} />
    </div>
  );
};
