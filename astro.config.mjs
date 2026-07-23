import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.2promo.it',
  output: 'static',
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 4321,
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      // escludi pagine di servizio dalla sitemap
      filter: (page) =>
        !page.includes('/grazie') &&
        !page.includes('/cookie') &&
        !page.includes('/privacy') &&
        !page.includes('/termini'),
    }),
  ],
  vite: {
    ssr: {
      external: ['node:buffer', 'node:path', 'node:crypto'],
    },
  },
});
