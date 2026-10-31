import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' permite publicar em GitHub Pages (subpasta) ou Vercel.
export default defineConfig({
  base: './',
  plugins: [react()],
})

