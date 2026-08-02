/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#030f26',       // Azul marino profundo para navbar y fondo principal
          card: '#111827',
          accent: '#2563EB',
          accentHover: '#1D4ED8',
          border: '#1F2937',
          text: '#F9FAFB',
          muted: '#9CA3AF'
        }
      }
    },
  },
  plugins: [],
}