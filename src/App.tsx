/**
 * App — Browser Preview Mode Entry Component
 */
import React, { useState, useCallback, useEffect } from 'react';
import { SceneOrchestrator } from '@/components/SceneOrchestrator';
import { StartOverlay } from '@/components/StartOverlay';
import { HUD } from '@/components/HUD';

const App: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const dir = (window as any).__director;
      if (!dir) return;
      switch (e.key) {
        case ' ': e.preventDefault(); dir.toggle(); break;
        case 'r': dir.restart(); break;
        case 'ArrowRight': dir.seek(dir.getTime() + 5); break;
        case 'ArrowLeft': dir.seek(Math.max(0, dir.getTime() - 5)); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleStart = useCallback(() => {
    setStarted(true);
    // Auto-play after overlay fades
    setTimeout(() => {
      const dir = (window as any).__director;
      dir?.play();
    }, 100);
  }, []);

  return (
    <div style={{
      width: '100vw', height: '100vh',
      overflow: 'hidden', background: '#0a0a0f',
    }}>
      {!started && <StartOverlay onStart={handleStart} />}

      <SceneOrchestrator
        mode="browser"
        width={dimensions.width}
        height={dimensions.height}
      />

      {started && <HUD />}
    </div>
  );
};

export default App;
