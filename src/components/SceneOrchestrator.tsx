/**
 * SceneOrchestrator — Master Scene Controller
 * Manages scene transitions, timing, and renders the active scene.
 */
import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { buildSceneTimeline, getSceneAtTime, getTotalDuration, type SceneTimelineEntry } from '@/config/scenes';
import { useSceneProgress } from '@/hooks/useSceneProgress';
import { Scene01_Awakening } from '@/scenes/Scene01_Awakening';
import { Scene05_EmptyCity } from '@/scenes/Scene05_EmptyCity';
import { Scene08_Finale } from '@/scenes/Scene08_Finale';
import { GlitchTransition } from '@/effects/GlitchTransition';
import { PALETTE } from '@/config/palette';
import { clamp, smoothstep } from '@/utils/math';

interface Props {
  /** Whether the orchestrator is in browser preview mode */
  mode: 'browser' | 'remotion';
  /** For Remotion: current frame. For browser: managed internally */
  frame?: number;
  fps?: number;
  width?: number;
  height?: number;
}

/** Scene registry — initial 3 scenes */
const SCENE_REGISTRY: Record<string, React.FC<any>> = {
  awakening: Scene01_Awakening,
  emptyCity: Scene05_EmptyCity,
  finale: Scene08_Finale,
};

/** Initial delivery uses only scenes 0, 4, 7 mapped to sequential playback */
const ACTIVE_SCENES = [
  { originalIndex: 0, id: 'awakening', duration: 25, fadeIn: 2.0, fadeOut: 1.5 },
  { originalIndex: 4, id: 'emptyCity', duration: 30, fadeIn: 2.0, fadeOut: 2.0 },
  { originalIndex: 7, id: 'finale', duration: 30, fadeIn: 2.0, fadeOut: 3.0 },
];

export const SceneOrchestrator: React.FC<Props> = ({
  mode = 'browser',
  frame,
  fps = 30,
  width = 1280,
  height = 720,
}) => {
  // Build timeline from active scenes
  const timeline = useMemo(() => {
    let cumulativeTime = 0;
    return ACTIVE_SCENES.map((s, i) => {
      const entry = { ...s, index: i, startTime: cumulativeTime };
      cumulativeTime += s.duration;
      return entry;
    });
  }, []);

  const totalDuration = useMemo(
    () => ACTIVE_SCENES.reduce((sum, s) => sum + s.duration, 0),
    []
  );

  // Time management
  const [globalTime, setGlobalTime] = useState(0);
  const globalTimeRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const lastTimestampRef = useRef(0);
  const isPlayingRef = useRef(false);

  // Determine current time based on mode
  const currentTime = mode === 'remotion' && frame !== undefined
    ? frame / fps
    : globalTime;

  // Find active scene
  const activeSceneEntry = useMemo(() => {
    for (let i = timeline.length - 1; i >= 0; i--) {
      if (currentTime >= timeline[i].startTime) return timeline[i];
    }
    return timeline[0];
  }, [currentTime, timeline]);

  const sceneTime = currentTime - activeSceneEntry.startTime;
  const progress = clamp(sceneTime / activeSceneEntry.duration, 0, 1);

  // Fade alpha
  let fadeAlpha = 1;
  if (sceneTime < activeSceneEntry.fadeIn) {
    fadeAlpha = smoothstep(0, activeSceneEntry.fadeIn, sceneTime);
  }
  if (sceneTime > activeSceneEntry.duration - activeSceneEntry.fadeOut) {
    fadeAlpha = smoothstep(activeSceneEntry.duration, activeSceneEntry.duration - activeSceneEntry.fadeOut, sceneTime);
  }
  fadeAlpha = clamp(fadeAlpha, 0, 1);

  // Browser mode animation loop
  const animate = useCallback((timestamp: number) => {
    if (!isPlayingRef.current) return;
    if (lastTimestampRef.current === 0) lastTimestampRef.current = timestamp;
    const dt = Math.min((timestamp - lastTimestampRef.current) / 1000, 0.1);
    lastTimestampRef.current = timestamp;

    setGlobalTime(prev => {
      const next = prev + dt;
      if (next >= totalDuration) {
        isPlayingRef.current = false;
        globalTimeRef.current = totalDuration;
        return totalDuration;
      }
      globalTimeRef.current = next;
      return next;
    });

    animFrameRef.current = requestAnimationFrame(animate);
  }, [totalDuration]);

  // Playback controls (exposed via window for HUD)
  useEffect(() => {
    if (mode !== 'browser') return;

    const controls = {
      play: () => { isPlayingRef.current = true; lastTimestampRef.current = 0; animFrameRef.current = requestAnimationFrame(animate); },
      pause: () => { isPlayingRef.current = false; cancelAnimationFrame(animFrameRef.current); },
      toggle: () => { isPlayingRef.current ? controls.pause() : controls.play(); },
      restart: () => { setGlobalTime(0); globalTimeRef.current = 0; controls.play(); },
      seek: (t: number) => { const nt = clamp(t, 0, totalDuration); setGlobalTime(nt); globalTimeRef.current = nt; },
      getTime: () => globalTimeRef.current,
      getTotalDuration: () => totalDuration,
      isPlaying: () => isPlayingRef.current,
    };
    (window as any).__director = controls;

    return () => { cancelAnimationFrame(animFrameRef.current); };
  }, [mode, animate, totalDuration]);

  // Render active scene
  const SceneComponent = SCENE_REGISTRY[activeSceneEntry.id];

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      overflow: 'hidden', background: PALETTE.voidBlack,
    }}>
      {SceneComponent && (
        <SceneComponent
          sceneTime={sceneTime}
          progress={progress}
          fadeAlpha={fadeAlpha}
          width={width}
          height={height}
        />
      )}
    </div>
  );
};
