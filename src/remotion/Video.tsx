/**
 * Video — Main Remotion Composition
 * Renders the SceneOrchestrator in Remotion mode.
 */
import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { SceneOrchestrator } from '@/components/SceneOrchestrator';

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0f' }}>
      <SceneOrchestrator
        mode="remotion"
        frame={frame}
        fps={fps}
        width={width}
        height={height}
      />
    </AbsoluteFill>
  );
};
