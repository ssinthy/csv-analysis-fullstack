import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import 'dotenv/config'

// @ts-ignore
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // @ts-ignore
      '/api': process.env.VITE_GW_SERVER,
    }
  }
})
