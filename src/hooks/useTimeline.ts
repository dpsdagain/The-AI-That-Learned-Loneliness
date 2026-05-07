/**
 * ═══════════════════════════════════════════════════════════════
 * useTimeline — GSAP Timeline Hook
 * ═══════════════════════════════════════════════════════════════
 *
 * Creates a GSAP timeline that can be manually seeked to sync
 * with either Remotion frames or browser playback time.
 */

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export interface TimelineHandle {
  timeline: gsap.core.Timeline;
  seekTo: (timeInSeconds: number) => void;
}

/**
 * Create a paused GSAP timeline. Call seekTo() each frame
 * to advance it to the correct position.
 *
 * @param builder - Function that populates the timeline with tweens
 * @param deps - Dependency array for rebuilding the timeline
 */
export function useTimeline(
  builder: (tl: gsap.core.Timeline) => void,
  deps: React.DependencyList = [],
): TimelineHandle {
  const tlRef = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));

  useEffect(() => {
    const tl = gsap.timeline({ paused: true });
    builder(tl);
    tlRef.current = tl;

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const seekTo = (timeInSeconds: number) => {
    tlRef.current.seek(timeInSeconds, false);
  };

  return {
    timeline: tlRef.current,
    seekTo,
  };
}
