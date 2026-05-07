/**
 * Scene08_Finale — Rooftop overlooking neon city, final monologue
 * Layers: 3D rooftop+city + 2D rain/fog/particles + Typography + fade to black
 */
import React, { useRef, useCallback, useMemo } from 'react';
import { CinematicCanvas } from '@/components/CinematicCanvas';
import { OverlayCanvas } from '@/components/OverlayCanvas';
import { Typography } from '@/components/Typography';
import { Vignette } from '@/components/Vignette';
import { RooftopScene } from '@/scenes/3d/RooftopScene';
import { CityScape } from '@/scenes/3d/CityScape';
import { RainSystem } from '@/effects/RainSystem';
import { FogSystem } from '@/effects/FogSystem';
import { ParticleEngine, PARTICLE_PRESETS } from '@/effects/ParticleEngine';
import { getNarrationForScene } from '@/config/narration';
import { smoothstep } from '@/utils/math';
import { PALETTE } from '@/config/palette';

interface Props {
  sceneTime: number;
  progress: number;
  fadeAlpha: number;
  width: number;
  height: number;
}

export const Scene08_Finale: React.FC<Props> = ({
  sceneTime, progress, fadeAlpha, width, height,
}) => {
  const narrationLines = useMemo(() => getNarrationForScene('finale'), []);

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
      particles: new ParticleEngine(PARTICLE_PRESETS.ambient, width, height, 0.3),
      lastTime: 0,
    };
  }

  // Title card and final fade
  const titleOpacity = smoothstep(25, 27, sceneTime) * (1 - smoothstep(29, 30, sceneTime));
  const finalFade = smoothstep(27, 30, sceneTime);

  const draw2D = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const eff = effectsRef.current!;
    const dt = Math.min(sceneTime - eff.lastTime, 0.1);
    eff.lastTime = sceneTime;

    eff.rain.setIntensity(0.5);
    eff.rain.update(dt);
    eff.rain.render(ctx, 0.5);

    eff.fog.setIntensity(0.4);
    eff.fog.update(dt);
    eff.fog.render(ctx, 0.3);

    eff.particles.update(dt);
    eff.particles.render(ctx, 0.2);
  }, [sceneTime]);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: fadeAlpha }}>
      <CinematicCanvas>
        <RooftopScene progress={progress} sceneTime={sceneTime} />
      </CinematicCanvas>

      <OverlayCanvas width={width} height={height} draw={draw2D} />
      <Typography lines={narrationLines} sceneTime={sceneTime} width={width} height={height} />

      {/* Title card */}
      {titleOpacity > 0.01 && (
        <div style={{
          position: 'absolute', top: '12%', left: 0, right: 0,
          textAlign: 'center', opacity: titleOpacity, zIndex: 15,
          fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
          fontSize: `${20 * (width / 1920)}px`,
          letterSpacing: '6px', color: PALETTE.ghostWhite,
          textShadow: `0 0 30px ${PALETTE.neonCyan}`,
        }}>
          THE AI THAT LEARNED LONELINESS
        </div>
      )}

      <Vignette intensity={0.6} />

      {/* Final fade to black */}
      {finalFade > 0 && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 30,
          backgroundColor: '#000', opacity: finalFade,
        }} />
      )}
    </div>
  );
};
