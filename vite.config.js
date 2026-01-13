import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/bird-reserve-game/'   // ← exact repo name, including the trailing slash
})