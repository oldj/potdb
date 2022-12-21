import * as path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), dts()],
  // root: path.join(__dirname, 'src', 'main'),
  base: './',
  build: {
    lib: {
      entry: path.join(__dirname, 'src', 'index.ts'),
      name: 'PotDb',
      formats: ['cjs'],
      // fileName: (format) => `main.${format}.js`,
      fileName: 'index.js',
    },
    outDir: path.join(__dirname, 'build'),
    minify: false,
    ssr: true,
    // emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src', 'core'),
    },
  },
})
