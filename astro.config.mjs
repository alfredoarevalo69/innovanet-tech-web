// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://sysarmortech.com',
  output: 'server', // <--- OBLIGATORIO: Habilita Serverless / SSR

  redirects: {
    '/servicios': '/#servicios',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});