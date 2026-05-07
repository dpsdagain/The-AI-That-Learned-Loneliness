/**
 * StartOverlay — Cinematic start screen with click-to-begin.
 */
import React, { useState, useRef, useCallback } from 'react';
import { PALETTE } from '@/config/palette';
import { AudioEngine } from '@/audio/AudioEngine';

interface Props {
  onStart: () => void;
}

export const StartOverlay: React.FC<Props> = ({ onStart }) => {
  const [fading, setFading] = useState(false);
  const audioRef = useRef(new AudioEngine());

  const handleClick = useCallback(async () => {
    try {
      await audioRef.current.init();
      await audioRef.current.start();
    } catch (e) { /* Audio may fail silently */ }

    setFading(true);
    setTimeout(() => onStart(), 800);
  }, [onStart]);

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: PALETTE.voidBlack, cursor: 'pointer',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.8s ease-out',
      }}
    >
      {/* Title */}
      <h1 style={{
        fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
        fontSize: 'clamp(24px, 5vw, 64px)',
        color: PALETTE.ghostWhite, textAlign: 'center',
        letterSpacing: '4px', lineHeight: 1.2, margin: 0,
        textShadow: `0 0 40px ${PALETTE.neonCyan}, 0 0 80px ${PALETTE.neonCyan}40`,
      }}>
        The AI That Learned<br />Loneliness
      </h1>

      {/* Subtitle */}
      <p style={{
        fontFamily: "'Orbitron', sans-serif", fontWeight: 400,
        fontSize: 'clamp(10px, 2vw, 20px)',
        color: PALETTE.mutedSteel, letterSpacing: '3px',
        marginTop: '24px', textTransform: 'uppercase',
      }}>
        A Cinematic Exploration of Digital Consciousness
      </p>

      {/* Play prompt */}
      <p style={{
        fontFamily: "'JetBrains Mono', monospace", fontWeight: 400,
        fontSize: 'clamp(10px, 1.5vw, 16px)',
        color: PALETTE.neonCyan, letterSpacing: '2px',
        marginTop: '60px', opacity: 0.8,
        animation: 'pulse-glow 2s ease-in-out infinite',
      }}>
        [ CLICK TO BEGIN ▌ ]
      </p>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; text-shadow: 0 0 10px ${PALETTE.neonCyan}40; }
          50% { opacity: 1; text-shadow: 0 0 20px ${PALETTE.neonCyan}80; }
        }
      `}</style>
    </div>
  );
};
