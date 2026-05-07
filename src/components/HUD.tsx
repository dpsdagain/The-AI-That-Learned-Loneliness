/**
 * HUD — Playback Controls & Progress Bar
 * Cinematic-styled playback controls for browser preview mode.
 */
import React, { useState, useEffect, useRef } from 'react';
import { PALETTE } from '@/config/palette';

export const HUD: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(85); // 25+30+30
  const intervalRef = useRef<number>(0);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      const dir = (window as any).__director;
      if (dir) {
        setIsPlaying(dir.isPlaying());
        setCurrentTime(dir.getTime());
        setTotalDuration(dir.getTotalDuration());
      }
    }, 100);
    return () => clearInterval(intervalRef.current);
  }, []);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const dir = (window as any).__director;
  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '10px 20px',
      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
      fontFamily: "'Orbitron', sans-serif", fontSize: '12px',
      color: PALETTE.ghostWhite, letterSpacing: '1px',
    }}>
      {/* Play/Pause */}
      <button
        onClick={() => dir?.toggle()}
        style={{
          background: 'none', border: `1px solid ${PALETTE.neonCyan}`,
          color: PALETTE.neonCyan, padding: '6px 12px', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: '14px', borderRadius: '2px',
        }}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      {/* Restart */}
      <button
        onClick={() => dir?.restart()}
        style={{
          background: 'none', border: `1px solid ${PALETTE.mutedSteel}`,
          color: PALETTE.mutedSteel, padding: '6px 12px', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: '14px', borderRadius: '2px',
        }}
      >
        ↻
      </button>

      {/* Progress bar */}
      <div
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          dir?.seek(pct * totalDuration);
        }}
        style={{
          flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)',
          borderRadius: '2px', cursor: 'pointer', position: 'relative',
        }}
      >
        <div style={{
          width: `${progress}%`, height: '100%',
          background: `linear-gradient(90deg, ${PALETTE.neonCyan}, ${PALETTE.electricPurple})`,
          borderRadius: '2px', transition: 'width 0.1s linear',
        }} />
      </div>

      {/* Time display */}
      <span style={{ minWidth: '100px', textAlign: 'right', opacity: 0.7 }}>
        {formatTime(currentTime)} / {formatTime(totalDuration)}
      </span>
    </div>
  );
};
