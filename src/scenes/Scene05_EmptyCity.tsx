/**
 * Scene05_EmptyCity — Wide cinematic shots of empty futuristic city at night
 * Layers: 3D cityscape + 2D rain/fog/particles + Typography
 */
import React, { useRef, useCallback, useMemo } from 'react';
import { CinematicCanvas } from '@/components/CinematicCanvas';
import { OverlayCanvas } from '@/components/OverlayCanvas';
import { Typography } from '@/components/Typography';
import { Vignette } from '@/components/Vignette';
import { CityScape } from '@/scenes/3d/CityScape';
import { RainSystem } from '@/effects/RainSystem';
import { FogSystem } from '@/effects/FogSystem';
import { ParticleEngine, PARTICLE_PRESETS } from '@/effects/ParticleEngine';
import { getNarrationForScene } from '@/config/narration';

interface Props {
  sceneTime: number;
  progress: number;
  fadeAlpha: number;
  width: number;
  height: number;
}

export const Scene05_EmptyCity: React.FC<Props> = ({
  sceneTime, progress, fadeAlpha, width, height,
}) => {
  const narrationLines = useMemo(() => getNarrationForScene('emptyCity'), []);

  const effectsRef = useRef<{
    rain: RainSystem;
    fog: FogSystem;
    particles: ParticleEngine;
    lastTime: number;
  } | null>(null);

  if (!effectsRef.current) {
    effectsRef.current = {
      rain: new RainSystem(width, height, 0.5),
      fog: new FogSystem(width, height),
      particles: new ParticleEngine(PARTICLE_PRESETS.ambient, width, height, 0.5),
      lastTime: 0,
    };
  }

  const draw2D = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const eff = effectsRef.current!;
    const dt = Math.min(sceneTime - eff.lastTime, 0.1);
    eff.lastTime = sceneTime;

    eff.rain.setIntensity(0.6);
    eff.rain.setWind(0.3 + Math.sin(sceneTime * 0.2) * 0.1);
    eff.rain.update(dt);
    eff.rain.render(ctx, 0.6);

    eff.fog.setIntensity(0.5);
    eff.fog.update(dt);
    eff.fog.render(ctx, 0.4);

    eff.particles.update(dt);
    eff.particles.render(ctx, 0.3);
  }, [sceneTime]);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: fadeAlpha }}>
      <CinematicCanvas>
        <CityScape progress={progress} sceneTime={sceneTime} variant="aerial" />
      </CinematicCanvas>

      <OverlayCanvas width={width} height={height} draw={draw2D} />
      <Typography lines={narrationLines} sceneTime={sceneTime} width={width} height={height} />
      <Vignette intensity={0.6} />
    </div>
  );
};
