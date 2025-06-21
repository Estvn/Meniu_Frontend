import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {VitePWA} from "vite-plugin-pwa";

export default defineConfig({  
  plugins: [    
    react(),
    tailwindcss(),
    VitePWA({
			registerType: 'autoUpdate', // Activar Servicew worker
			includeAssets: ['favicon.svg', 'robots.txt'],
			workbox: { // Carga elementos sin conexión
				navigateFallback: '/index.html', // Use este archivo cuando no hay internet
				globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'] // Archivos cacheados
			},
			manifest: {
				name: 'App React',
				short_name: 'React',
				description: 'App React+Vite PWA',
				start_url: '/',
				display: 'standalone', // Habilitar instalación en dispositivos
				background_color: '#ffffff',
				theme_color: '#228be6'
      }
		})
  ],
})