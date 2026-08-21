import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://beverleyy.github.io',

  /* Deploying to a PROJECT page (beverleyy.github.io/hub-run) rather than a
     custom domain? Uncomment this. Nothing else needs changing: the fonts are
     bundled through Vite and the favicon uses import.meta.env.BASE_URL, so
     both follow `base` automatically. */
  base: '/hub-run',

  integrations: [tailwind({ applyBaseStyles: false })],
});
