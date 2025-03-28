import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {nodePolyfills} from 'vite-plugin-node-polyfills';
import EnvironmentPlugin from 'vite-plugin-environment';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    EnvironmentPlugin(['VITE_APP_URL']),
    nodePolyfills({
      globals: {
        process: true,
      },
    }),
  ],
})
