import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    glsl({
      include: ['**/*.glsl', '**/*.vert', '**/*.frag'],
      compress: false,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/scenes': resolve(__dirname, 'src/scenes'),
      '@/shaders': resolve(__dirname, 'src/shaders'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/effects': resolve(__dirname, 'src/effects'),
      '@/config': resolve(__dirname, 'src/config'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/audio': resolve(__dirname, 'src/audio'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          gsap: ['gsap'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', 'gsap'],
  },
});
