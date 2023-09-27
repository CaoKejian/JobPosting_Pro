import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { svgstore } from './src/vite_plugins/svgstore.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),svgstore()],
  // server: {
  //   port: 3001,
  // },
})
