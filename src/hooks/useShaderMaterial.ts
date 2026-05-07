/**
 * ═══════════════════════════════════════════════════════════════
 * useShaderMaterial — Custom Shader Material Hook
 * ═══════════════════════════════════════════════════════════════
 *
 * Creates a Three.js ShaderMaterial with auto-updating uniforms.
 */

import { useMemo } from 'react';
import * as THREE from 'three';

export interface ShaderConfig {
  vertexShader: string;
  fragmentShader: string;
  uniforms?: Record<string, THREE.IUniform>;
  transparent?: boolean;
  side?: THREE.Side;
  depthWrite?: boolean;
  blending?: THREE.Blending;
}

export function useShaderMaterial(config: ShaderConfig): THREE.ShaderMaterial {
  return useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: config.vertexShader,
      fragmentShader: config.fragmentShader,
      uniforms: config.uniforms ?? {},
      transparent: config.transparent ?? true,
      side: config.side ?? THREE.FrontSide,
      depthWrite: config.depthWrite ?? false,
      blending: config.blending ?? THREE.NormalBlending,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.vertexShader, config.fragmentShader]);
}
