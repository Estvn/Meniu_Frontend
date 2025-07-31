import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa";

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
				name: 'Meniu',
				short_name: 'Meniu',
				description: 'App Meniu PWA',
				start_url: '/',
				display: 'standalone', // Habilitar instalación en dispositivos
				background_color: '#ffffff',
				theme_color: '#228be6',
				screenshots: [
					{
						src: '/screenshots/logo1.png',
						type: 'image/png',
						sizes: '320x320',
						form_factor: 'wide'
					}
				],
				icons: [
					{
						src: './icons/logoHorizontal.png',
						sizes: '320x320',
						type: 'image/png',
					}]


			}
		})
	],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				secure: false,
			},
			'/productos': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				secure: false,
			}
		}
	}
})