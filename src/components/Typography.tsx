/**
 * Typography — Cinematic Narration Text Renderer
 * Renders narration lines with fade, typewriter, and glitch styles.
 */
import React, { useMemo } from 'react';
import { NarrationLine } from '@/config/narration';
import { PALETTE } from '@/config/palette';
import { smoothstep, clamp } from '@/utils/math';

interface Props {
  lines: NarrationLine[];
  sceneTime: number;
  width: number;
  height: number;
}

export const Typography: React.FC<Props> = ({ lines, sceneTime, width, height }) => {
  const activeLines = useMemo(() => {
    return lines.filter(line => {
      const start = line.time;
      const end = line.time + line.duration;
      return sceneTime >= start - 0.5 && sceneTime <= end + 0.5;
    });
  }, [lines, sceneTime]);

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '0 10%', paddingBottom: height * 0.08,
      pointerEvents: 'none', zIndex: 10,
    }}>
      {activeLines.map((line, i) => {
        const localT = sceneTime - line.time;
        const fadeIn = smoothstep(0, 0.8, localT);
        const fadeOut = smoothstep(line.duration, line.duration - 0.8, localT);
        let opacity = fadeIn * fadeOut;

        // Typewriter: reveal characters progressively
        let displayText = line.text;
        let transform = '';
        if (line.style === 'typewriter') {
          const charCount = Math.floor(clamp(localT / line.duration, 0, 1) * line.text.length * 1.5);
          displayText = line.text.substring(0, Math.min(charCount, line.text.length));
        }

        // Fade up: slide from below
        if (line.style === 'fadeUp' || !line.style) {
          const slideUp = smoothstep(0, 0.6, localT);
          transform = `translateY(${(1 - slideUp) * 20}px)`;
        }

        // Glitch: random horizontal jitter
        if (line.style === 'glitch') {
          const jitter = Math.sin(sceneTime * 50) * (1 - smoothstep(0, 0.3, localT)) * 5;
          transform = `translateX(${jitter}px)`;
        }

        const fontSize = line.emphasis ? 36 : 30;
        const glowColor = line.emphasis ? PALETTE.neonCyan : 'transparent';

        return (
          <div
            key={`${line.text}-${i}`}
            style={{
              opacity: clamp(opacity, 0, 1),
              transform,
              transition: 'none',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: `${fontSize * (width / 1920)}px`,
              color: PALETTE.ghostWhite,
              textAlign: 'center',
              letterSpacing: '0.5px',
              lineHeight: 1.5,
              textShadow: line.emphasis
                ? `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`
                : `0 0 10px rgba(0,240,255,0.2)`,
              marginBottom: '8px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {displayText}
            {line.style === 'typewriter' && displayText.length < line.text.length && (
              <span style={{ opacity: Math.sin(sceneTime * 8) > 0 ? 1 : 0 }}>▌</span>
            )}
          </div>
        );
      })}
    </div>
  );
};
